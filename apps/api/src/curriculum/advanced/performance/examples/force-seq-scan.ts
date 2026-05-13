import { sql } from 'drizzle-orm';
import type { ExampleDef } from '../../../types.ts';

const example: ExampleDef = {
  id: 'force-seq-scan',
  title: 'Seq Scan — 无索引时全表扫',
  support: 'partial',
  timeoutMs: 30000,
  display: {
    sql: `-- status 没有索引，PG 只能 Seq Scan
EXPLAIN ANALYZE
SELECT count(*) FROM orders
WHERE status = 'paid';`,
    drizzle: `import { sql } from 'drizzle-orm';

await db.execute(sql\`
  EXPLAIN ANALYZE
  SELECT count(*) FROM orders
  WHERE status = 'paid'
\`);`,
  },
  execute: (db) =>
    db.execute(sql`
      EXPLAIN ANALYZE
      SELECT count(*) FROM orders
      WHERE status = 'paid'
    `),
};

export default example;
