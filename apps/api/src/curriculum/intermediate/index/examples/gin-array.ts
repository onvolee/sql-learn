import { sql } from 'drizzle-orm';
import type { ExampleDef } from '../../../types.ts';

const example: ExampleDef = {
  id: 'gin-array',
  title: 'GIN 索引数组（&& 相交查询）',
  support: 'partial',
  timeoutMs: 30000,
  display: {
    sql: `CREATE INDEX IF NOT EXISTS events_tags_gin
  ON events USING gin (tags);

EXPLAIN
SELECT id, tags
FROM events
WHERE tags && ARRAY['vip', 'beta'];`,
    drizzle: `import { sql } from 'drizzle-orm';

await db.execute(sql\`
  CREATE INDEX IF NOT EXISTS events_tags_gin
    ON events USING gin (tags)
\`);

await db.execute(sql\`
  EXPLAIN
  SELECT id, tags
  FROM events
  WHERE tags && ARRAY['vip', 'beta']
\`);`,
  },
  execute: async (db) => {
    await db.execute(sql`CREATE INDEX IF NOT EXISTS events_tags_gin ON events USING gin (tags)`);
    return db.execute(sql`
      EXPLAIN
      SELECT id, tags
      FROM events
      WHERE tags && ARRAY['vip', 'beta']
    `);
  },
};

export default example;
