import { sql } from 'drizzle-orm';
import type { ExampleDef } from '../../../types.ts';

const example: ExampleDef = {
  id: 'btree-create-and-explain',
  title: '建 B-tree 索引并 EXPLAIN',
  support: 'partial',
  timeoutMs: 30000,
  display: {
    sql: `CREATE INDEX IF NOT EXISTS events_ts_idx ON events (ts);

EXPLAIN
SELECT * FROM events
WHERE ts > now() - interval '7 days'
ORDER BY ts DESC
LIMIT 100;`,
    drizzle: `import { sql } from 'drizzle-orm';

await db.execute(sql\`
  CREATE INDEX IF NOT EXISTS events_ts_idx ON events (ts)
\`);

await db.execute(sql\`
  EXPLAIN
  SELECT * FROM events
  WHERE ts > now() - interval '7 days'
  ORDER BY ts DESC
  LIMIT 100
\`);`,
  },
  execute: async (db) => {
    await db.execute(sql`CREATE INDEX IF NOT EXISTS events_ts_idx ON events (ts)`);
    return db.execute(sql`
      EXPLAIN
      SELECT * FROM events
      WHERE ts > now() - interval '7 days'
      ORDER BY ts DESC
      LIMIT 100
    `);
  },
};

export default example;
