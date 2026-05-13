import { sql } from 'drizzle-orm';
import type { ExampleDef } from '../../../types.ts';

const example: ExampleDef = {
  id: 'hash-create-and-explain',
  title: '建 Hash 索引并 EXPLAIN 等值查询',
  support: 'partial',
  timeoutMs: 30000,
  display: {
    sql: `CREATE INDEX IF NOT EXISTS events_kind_hash ON events USING hash (kind);

EXPLAIN
SELECT id, ts
FROM events
WHERE kind = 'error';`,
    drizzle: `import { sql } from 'drizzle-orm';

await db.execute(sql\`
  CREATE INDEX IF NOT EXISTS events_kind_hash ON events USING hash (kind)
\`);

await db.execute(sql\`
  EXPLAIN
  SELECT id, ts
  FROM events
  WHERE kind = 'error'
\`);`,
  },
  execute: async (db) => {
    await db.execute(sql`CREATE INDEX IF NOT EXISTS events_kind_hash ON events USING hash (kind)`);
    return db.execute(sql`
      EXPLAIN
      SELECT id, ts
      FROM events
      WHERE kind = 'error'
    `);
  },
};

export default example;
