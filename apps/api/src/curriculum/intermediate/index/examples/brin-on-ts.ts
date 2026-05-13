import { sql } from 'drizzle-orm';
import type { ExampleDef } from '../../../types.ts';

const example: ExampleDef = {
  id: 'brin-on-ts',
  title: 'BRIN 索引 ts 范围扫描',
  support: 'partial',
  timeoutMs: 30000,
  display: {
    sql: `CREATE INDEX IF NOT EXISTS events_ts_brin
  ON events USING brin (ts);

EXPLAIN
SELECT count(*)
FROM events
WHERE ts > now() - interval '60 days'
  AND ts < now() - interval '30 days';`,
    drizzle: `import { sql } from 'drizzle-orm';

await db.execute(sql\`
  CREATE INDEX IF NOT EXISTS events_ts_brin
    ON events USING brin (ts)
\`);

await db.execute(sql\`
  EXPLAIN
  SELECT count(*)
  FROM events
  WHERE ts > now() - interval '60 days'
    AND ts < now() - interval '30 days'
\`);`,
  },
  execute: async (db) => {
    await db.execute(sql`CREATE INDEX IF NOT EXISTS events_ts_brin ON events USING brin (ts)`);
    return db.execute(sql`
      EXPLAIN
      SELECT count(*)
      FROM events
      WHERE ts > now() - interval '60 days'
        AND ts < now() - interval '30 days'
    `);
  },
};

export default example;
