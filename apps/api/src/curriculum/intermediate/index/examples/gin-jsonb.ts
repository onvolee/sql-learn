import { sql } from 'drizzle-orm';
import type { ExampleDef } from '../../../types.ts';

const example: ExampleDef = {
  id: 'gin-jsonb',
  title: 'GIN 索引 JSONB（@> 包含查询）',
  support: 'partial',
  timeoutMs: 30000,
  display: {
    sql: `CREATE INDEX IF NOT EXISTS events_payload_gin
  ON events USING gin (payload);

EXPLAIN
SELECT id, ts, payload
FROM events
WHERE payload @> '{"user_id": 1}'::jsonb;`,
    drizzle: `import { sql } from 'drizzle-orm';

await db.execute(sql\`
  CREATE INDEX IF NOT EXISTS events_payload_gin
    ON events USING gin (payload)
\`);

await db.execute(sql\`
  EXPLAIN
  SELECT id, ts, payload
  FROM events
  WHERE payload @> '{"user_id": 1}'::jsonb
\`);`,
  },
  execute: async (db) => {
    await db.execute(sql`CREATE INDEX IF NOT EXISTS events_payload_gin ON events USING gin (payload)`);
    return db.execute(sql`
      EXPLAIN
      SELECT id, ts, payload
      FROM events
      WHERE payload @> '{"user_id": 1}'::jsonb
    `);
  },
};

export default example;
