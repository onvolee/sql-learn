import { sql } from 'drizzle-orm';
import type { ExampleDef } from '../../../types.ts';

const example: ExampleDef = {
  id: 'explain-plain',
  title: 'EXPLAIN — 只看计划，不真跑',
  support: 'partial',
  timeoutMs: 30000,
  display: {
    sql: `EXPLAIN
SELECT * FROM orders
WHERE customer_id = 42;`,
    drizzle: `import { sql } from 'drizzle-orm';

await db.execute(sql\`
  EXPLAIN
  SELECT * FROM orders
  WHERE customer_id = 42
\`);`,
  },
  execute: (db) =>
    db.execute(sql`
      EXPLAIN
      SELECT * FROM orders
      WHERE customer_id = 42
    `),
};

export default example;
