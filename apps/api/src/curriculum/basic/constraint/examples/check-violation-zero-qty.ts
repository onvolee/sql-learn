import { sql } from 'drizzle-orm';
import type { ExampleDef } from '../../../types.ts';

const example: ExampleDef = {
  id: 'check-violation-zero-qty',
  title: 'CHECK (qty > 0) 拒绝 0 → SQLSTATE 23514',
  support: 'partial',
  display: {
    sql: `INSERT INTO order_items (order_id, line_no, product, qty)
VALUES (1, 99, 'free-sample', 0);
-- 期望失败：SQLSTATE 23514（check_violation）
-- 约束 order_items_qty_positive: qty > 0`,
    drizzle: `import { sql } from 'drizzle-orm';

// 期望失败：SQLSTATE 23514（check_violation）
await db.execute(sql\`
  INSERT INTO order_items (order_id, line_no, product, qty)
  VALUES (1, 99, 'free-sample', 0)
\`);`,
  },
  execute: (db) =>
    db.execute(sql`
      INSERT INTO order_items (order_id, line_no, product, qty)
      VALUES (1, 99, 'free-sample', 0)
    `),
};

export default example;
