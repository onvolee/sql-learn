import { sql } from 'drizzle-orm';
import type { ExampleDef } from '../../../types.ts';

const SENTINEL = Symbol('cascade-rollback');

const example: ExampleDef = {
  id: 'fk-cascade-delete',
  title: 'ON DELETE CASCADE 连带删除子行',
  support: 'partial',
  display: {
    sql: `-- 删主行（orders.id = 1）→ FK ON DELETE CASCADE 自动删掉
-- order_items 中所有 order_id = 1 的子行。
-- 用 SAVEPOINT 包住整个演示，最后回滚以保留 seed 状态。
SAVEPOINT demo;

SELECT count(*)::int AS items_before
FROM order_items WHERE order_id = 1;

DELETE FROM orders WHERE id = 1;

SELECT count(*)::int AS items_after
FROM order_items WHERE order_id = 1;

ROLLBACK TO SAVEPOINT demo;`,
    drizzle: `import { sql } from 'drizzle-orm';

// 用嵌套事务（drizzle 自动转为 SAVEPOINT）演示级联，
// 故意抛出 sentinel 来回滚，保留 seed 数据。
const SENTINEL = Symbol('cascade-rollback');

try {
  await db.transaction(async (sp) => {
    const before = await sp.execute(sql\`
      SELECT count(*)::int AS items_count
      FROM order_items WHERE order_id = 1
    \`);
    await sp.execute(sql\`DELETE FROM orders WHERE id = 1\`);
    const after = await sp.execute(sql\`
      SELECT count(*)::int AS items_count
      FROM order_items WHERE order_id = 1
    \`);
    throw { [SENTINEL]: true, before, after };
  });
} catch (e) {
  if (e && (e as any)[SENTINEL]) {
    // 展示 before / after 即可
  } else {
    throw e;
  }
}`,
  },
  execute: async (db) => {
    try {
      await db.transaction(async (sp) => {
        const before = await sp.execute(
          sql`SELECT 'before' AS phase, count(*)::int AS items_count
              FROM order_items WHERE order_id = 1`,
        );
        await sp.execute(sql`DELETE FROM orders WHERE id = 1`);
        const after = await sp.execute(
          sql`SELECT 'after' AS phase, count(*)::int AS items_count
              FROM order_items WHERE order_id = 1`,
        );
        const beforeRows = (before as { rows?: unknown[] }).rows ?? [];
        const afterRows = (after as { rows?: unknown[] }).rows ?? [];
        const rows = [...beforeRows, ...afterRows];
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
