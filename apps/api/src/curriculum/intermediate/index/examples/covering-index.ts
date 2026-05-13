import { sql } from 'drizzle-orm';
import type { ExampleDef } from '../../../types.ts';

const example: ExampleDef = {
  id: 'covering-index',
  title: '覆盖索引：INCLUDE 触发 Index Only Scan',
  support: 'partial',
  timeoutMs: 30000,
  display: {
    sql: `CREATE INDEX IF NOT EXISTS events_ts_covering_idx
  ON events (ts) INCLUDE (kind);

EXPLAIN
SELECT ts, kind
FROM events
WHERE ts > now() - interval '7 days';`,
    drizzle: `import { sql } from 'drizzle-orm';

await db.execute(sql\`
  CREATE INDEX IF NOT EXISTS events_ts_covering_idx
    ON events (ts) INCLUDE (kind)
\`);

await db.execute(sql\`
  EXPLAIN
  SELECT ts, kind
  FROM events
  WHERE ts > now() - interval '7 days'
\`);`,
  },
  execute: async (db) => {
    await db.execute(sql`
      CREATE INDEX IF NOT EXISTS events_ts_covering_idx
        ON events (ts) INCLUDE (kind)
    `);
    return db.execute(sql`
      EXPLAIN
      SELECT ts, kind
      FROM events
      WHERE ts > now() - interval '7 days'
    `);
  },
};

export default example;
