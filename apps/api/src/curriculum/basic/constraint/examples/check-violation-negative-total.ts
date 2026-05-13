import { sql } from 'drizzle-orm';
import type { ExampleDef } from '../../../types.ts';

const example: ExampleDef = {
  id: 'check-violation-negative-total',
  title: 'CHECK (total >= 0) 拒绝负数 → SQLSTATE 23514',
  support: 'partial',
  display: {
    sql: `INSERT INTO orders (customer, total)
VALUES ('eve', -1);
-- 期望失败：SQLSTATE 23514（check_violation）
-- 约束 orders_total_non_negative: total >= 0`,
    drizzle: `import { sql } from 'drizzle-orm';

// 期望失败：SQLSTATE 23514（check_violation）
await db.execute(sql\`
  INSERT INTO orders (customer, total)
  VALUES ('eve', -1)
\`);`,
  },
  execute: (db) =>
    db.execute(sql`INSERT INTO orders (customer, total) VALUES ('eve', -1)`),
};

export default example;
