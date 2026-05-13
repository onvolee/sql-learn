import { sql } from 'drizzle-orm';
import type { ExampleDef } from '../../../types.ts';

const example: ExampleDef = {
  id: 'auto-route-insert',
  title: 'INSERT 自动路由：看落到哪个子表',
  support: 'partial',
  display: {
    sql: `INSERT INTO sales (region, sold_at, amount)
VALUES ('east', '2025-05-15', 100.00)
RETURNING tableoid::regclass AS partition, id, sold_at;
-- sold_at = 2025-05-15 落在 [2025-04-01, 2025-07-01) 区间，期望进 sales_q2`,
    drizzle: `import { sql } from 'drizzle-orm';

await db.execute(sql\`
  INSERT INTO sales (region, sold_at, amount)
  VALUES ('east', '2025-05-15', 100.00)
  RETURNING tableoid::regclass AS partition, id, sold_at
\`);`,
  },
  execute: (db) =>
    db.execute(sql`
      INSERT INTO sales (region, sold_at, amount)
      VALUES ('east', '2025-05-15', 100.00)
      RETURNING tableoid::regclass::text AS partition, id, sold_at
    `),
};

export default example;
