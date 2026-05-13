import { sql } from 'drizzle-orm';
import type { ExampleDef } from '../../../types.ts';

const example: ExampleDef = {
  id: 'partial-index',
  title: '部分索引：只索引 kind = error',
  support: 'partial',
  timeoutMs: 30000,
  display: {
    sql: `CREATE INDEX IF NOT EXISTS events_error_only_idx
  ON events (ts)
  WHERE kind = 'error';

EXPLAIN
SELECT id, ts
FROM events
WHERE kind = 'error'
  AND ts > now() - interval '30 days';`,
    drizzle: `import { sql } from 'drizzle-orm';

await db.execute(sql\`
  CREATE INDEX IF NOT EXISTS events_error_only_idx
    ON events (ts)
    WHERE kind = 'error'
\`);

await db.execute(sql\`
  EXPLAIN
  SELECT id, ts
  FROM events
  WHERE kind = 'error'
    AND ts > now() - interval '30 days'
\`);`,
  },
  execute: async (db) => {
    await db.execute(sql`
      CREATE INDEX IF NOT EXISTS events_error_only_idx
        ON events (ts)
        WHERE kind = 'error'
    `);
    return db.execute(sql`
      EXPLAIN
      SELECT id, ts
      FROM events
      WHERE kind = 'error'
        AND ts > now() - interval '30 days'
    `);
  },
};

export default example;
