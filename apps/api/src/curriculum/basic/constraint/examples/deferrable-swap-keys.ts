import { sql } from 'drizzle-orm';
import type { ExampleDef } from '../../../types.ts';

const SENTINEL = Symbol('deferrable-rollback');

const example: ExampleDef = {
  id: 'deferrable-swap-keys',
  title: 'DEFERRABLE FK 允许中间状态违反',
  support: 'partial',
  display: {
    sql: `-- 演示：把 order_items.order_id 这条 FK 临时改为 DEFERRABLE，
-- 在事务里先插入引用了「还不存在」的父行的子行，再补插父行；
-- 由于约束被延迟到事务提交，中间瞬间违反 FK 也不会立刻报错。
-- 整个演示包在 SAVEPOINT 内，结束回滚还原 ALTER 与插入。
SAVEPOINT demo;

ALTER TABLE order_items
  DROP CONSTRAINT order_items_order_id_fkey;
ALTER TABLE order_items
  ADD CONSTRAINT order_items_order_id_fkey
  FOREIGN KEY (order_id) REFERENCES orders(id)
  ON DELETE CASCADE
  DEFERRABLE INITIALLY DEFERRED;

-- 先插子行，此时父行 id=777 不存在 —— 若 FK 非 deferred 会立刻 23503。
INSERT INTO order_items (order_id, line_no, product, qty)
VALUES (777, 1, 'preordered', 1);

-- 提交前补上父行，事务结束时 FK 检查通过。
INSERT INTO orders (id, customer, total) VALUES (777, 'late-customer', 1.00);

SELECT conname, condeferrable, condeferred
FROM pg_constraint
WHERE conname = 'order_items_order_id_fkey';

ROLLBACK TO SAVEPOINT demo;`,
    drizzle: `import { sql } from 'drizzle-orm';

// 用 SAVEPOINT 包整段，避免 ALTER 污染持久状态。
// 抛 sentinel 让 savepoint 回滚，再在外层取出结果返回。
await db.transaction(async (sp) => {
  await sp.execute(sql\`
    ALTER TABLE order_items
      DROP CONSTRAINT order_items_order_id_fkey
  \`);
  await sp.execute(sql\`
    ALTER TABLE order_items
      ADD CONSTRAINT order_items_order_id_fkey
      FOREIGN KEY (order_id) REFERENCES orders(id)
      ON DELETE CASCADE
      DEFERRABLE INITIALLY DEFERRED
  \`);
  await sp.execute(sql\`
    INSERT INTO order_items (order_id, line_no, product, qty)
    VALUES (777, 1, 'preordered', 1)
  \`);
  await sp.execute(sql\`
    INSERT INTO orders (id, customer, total) VALUES (777, 'late-customer', 1.00)
  \`);
  // ... 然后回滚以保留 seed
});`,
  },
  execute: async (db) => {
    try {
      await db.transaction(async (sp) => {
        await sp.execute(sql`
          ALTER TABLE order_items
            DROP CONSTRAINT order_items_order_id_fkey
        `);
        await sp.execute(sql`
          ALTER TABLE order_items
            ADD CONSTRAINT order_items_order_id_fkey
            FOREIGN KEY (order_id) REFERENCES orders(id)
            ON DELETE CASCADE
            DEFERRABLE INITIALLY DEFERRED
        `);
        // 中间状态违反 FK —— deferred 允许暂时存在
        await sp.execute(sql`
          INSERT INTO order_items (order_id, line_no, product, qty)
          VALUES (777, 1, 'preordered', 1)
        `);
        // 在 commit 之前补上父行 —— FK 检查在事务/savepoint 提交时进行
        await sp.execute(sql`
          INSERT INTO orders (id, customer, total) VALUES (777, 'late-customer', 1.00)
        `);
        const result = await sp.execute(sql`
          SELECT conname, condeferrable, condeferred
          FROM pg_constraint
          WHERE conname = 'order_items_order_id_fkey'
        `);
        const rows = (result as { rows?: unknown[] }).rows ?? [];
        throw { [SENTINEL]: true, rows };
      });
    } catch (e) {
      if (e && typeof e === 'object' && (e as Record<symbol, unknown>)[SENTINEL]) {
        const payload = e as { rows: unknown[] };
        return { rows: payload.rows };
      }
      throw e;
    }
    return { rows: [] };
  },
};

export default example;
