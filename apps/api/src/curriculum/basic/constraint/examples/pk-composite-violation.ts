import { sql } from 'drizzle-orm';
import type { ExampleDef } from '../../../types.ts';

const example: ExampleDef = {
  id: 'pk-composite-violation',
  title: '复合主键重复 → SQLSTATE 23505',
  support: 'partial',
  display: {
    sql: `INSERT INTO order_items (order_id, line_no, product, qty)
VALUES (1, 1, 'duplicate', 1);
-- 期望失败：SQLSTATE 23505（unique_violation）
-- (order_id, line_no) = (1, 1) 已存在`,
    drizzle: `import { sql } from 'drizzle-orm';

// 期望失败：SQLSTATE 23505（unique_violation）
await db.execute(sql\`
  INSERT INTO order_items (order_id, line_no, product, qty)
  VALUES (1, 1, 'duplicate', 1)
\`);`,
  },
  execute: (db) =>
    db.execute(sql`
      INSERT INTO order_items (order_id, line_no, product, qty)
      VALUES (1, 1, 'duplicate', 1)
    `),
};

export default example;
