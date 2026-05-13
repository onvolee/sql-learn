import { sql } from 'drizzle-orm';
import type { ExampleDef } from '../../../types.ts';

const example: ExampleDef = {
  id: 'expression-index',
  title: '表达式索引：lower(kind)',
  support: 'partial',
  timeoutMs: 30000,
  display: {
    sql: `CREATE INDEX IF NOT EXISTS events_lower_kind_idx
  ON events (lower(kind));

EXPLAIN
SELECT id, kind
FROM events
WHERE lower(kind) = 'error';`,
    drizzle: `import { sql } from 'drizzle-orm';

await db.execute(sql\`
  CREATE INDEX IF NOT EXISTS events_lower_kind_idx
    ON events (lower(kind))
\`);

await db.execute(sql\`
  EXPLAIN
  SELECT id, kind
  FROM events
  WHERE lower(kind) = 'error'
\`);`,
  },
  execute: async (db) => {
    await db.execute(sql`CREATE INDEX IF NOT EXISTS events_lower_kind_idx ON events (lower(kind))`);
    return db.execute(sql`
      EXPLAIN
      SELECT id, kind
      FROM events
      WHERE lower(kind) = 'error'
    `);
  },
};

export default example;
