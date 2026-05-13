import { sql } from 'drizzle-orm';
import type { ExampleDef } from '../../../types.ts';

const example: ExampleDef = {
  id: 'explain-analyze-buffers',
  title: 'EXPLAIN (ANALYZE, BUFFERS) — 实测 + 缓存',
  support: 'partial',
  timeoutMs: 30000,
  display: {
    sql: `EXPLAIN (ANALYZE, BUFFERS)
SELECT * FROM orders
WHERE customer_id = 42;`,
    drizzle: `import { sql } from 'drizzle-orm';

await db.execute(sql\`
  EXPLAIN (ANALYZE, BUFFERS)
  SELECT * FROM orders
  WHERE customer_id = 42
\`);`,
  },
  execute: (db) =>
    db.execute(sql`
      EXPLAIN (ANALYZE, BUFFERS)
      SELECT * FROM orders
      WHERE customer_id = 42
    `),
};

export default example;
