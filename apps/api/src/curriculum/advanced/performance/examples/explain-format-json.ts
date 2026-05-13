import { sql } from 'drizzle-orm';
import type { ExampleDef } from '../../../types.ts';

const example: ExampleDef = {
  id: 'explain-format-json',
  title: 'EXPLAIN (FORMAT JSON) — 机器可读',
  support: 'partial',
  timeoutMs: 30000,
  display: {
    sql: `EXPLAIN (FORMAT JSON)
SELECT * FROM orders
WHERE customer_id = 42;`,
    drizzle: `import { sql } from 'drizzle-orm';

await db.execute(sql\`
  EXPLAIN (FORMAT JSON)
  SELECT * FROM orders
  WHERE customer_id = 42
\`);`,
  },
  execute: (db) =>
    db.execute(sql`
      EXPLAIN (FORMAT JSON)
      SELECT * FROM orders
      WHERE customer_id = 42
    `),
};

export default example;
