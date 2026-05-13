import { sql } from 'drizzle-orm';
import type { ExampleDef } from '../../../types.ts';

const example: ExampleDef = {
  id: 'unique-violation',
  title: '临时加 UNIQUE → 插重复 → SQLSTATE 23505',
  support: 'partial',
  display: {
    sql: `-- 把 customer 临时改为 UNIQUE 再插入重复值。
-- 期望失败：SQLSTATE 23505（unique_violation）。
-- 整个 example 跑在 /exec 的外层事务里，失败时 ALTER 会一起回滚，
-- seed 状态不变。
ALTER TABLE orders
  ADD CONSTRAINT uq_orders_customer UNIQUE (customer);

INSERT INTO orders (customer, status, total)
VALUES ('alice', 'pending', 10.00);`,
    drizzle: `import { sql } from 'drizzle-orm';

// 外层事务自动回滚 → ALTER + 失败的 INSERT 都不持久化
await db.execute(sql\`
  ALTER TABLE orders
    ADD CONSTRAINT uq_orders_customer UNIQUE (customer)
\`);
// 期望失败：SQLSTATE 23505（unique_violation）
await db.execute(sql\`
  INSERT INTO orders (customer, status, total)
  VALUES ('alice', 'pending', 10.00)
\`);`,
  },
  execute: async (db) => {
    await db.execute(sql`
      ALTER TABLE orders
        ADD CONSTRAINT uq_orders_customer UNIQUE (customer)
    `);
    return db.execute(sql`
      INSERT INTO orders (customer, status, total)
      VALUES ('alice', 'pending', 10.00)
    `);
  },
};

export default example;
