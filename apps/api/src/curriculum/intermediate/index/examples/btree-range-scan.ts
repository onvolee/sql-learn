import { sql } from 'drizzle-orm';
import type { ExampleDef } from '../../../types.ts';

const example: ExampleDef = {
  id: 'btree-range-scan',
  title: '范围查询走 B-tree',
  support: 'partial',
  timeoutMs: 30000,
  display: {
    sql: `EXPLAIN
SELECT id, ts, kind
FROM events
WHERE ts BETWEEN now() - interval '30 days'
            AND now() - interval '20 days';`,
    drizzle: `import { sql } from 'drizzle-orm';

await db.execute(sql\`
  EXPLAIN
  SELECT id, ts, kind
  FROM events
  WHERE ts BETWEEN now() - interval '30 days'
              AND now() - interval '20 days'
\`);`,
  },
  execute: (db) =>
    db.execute(sql`
      EXPLAIN
      SELECT id, ts, kind
      FROM events
      WHERE ts BETWEEN now() - interval '30 days'
                  AND now() - interval '20 days'
    `),
};

export default example;
