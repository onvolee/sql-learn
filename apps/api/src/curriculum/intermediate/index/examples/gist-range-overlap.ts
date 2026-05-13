import { sql } from 'drizzle-orm';
import type { ExampleDef } from '../../../types.ts';

// 在 events 上动态加一个 tsrange 列（[ts, ts + 1h)）并建 GiST，然后用 && 重叠查询。
// 所有 DDL 都用 IF NOT EXISTS，重复运行无副作用。
const example: ExampleDef = {
  id: 'gist-range-overlap',
  title: 'GiST 索引范围（&& 重叠查询）',
  support: 'partial',
  timeoutMs: 30000,
  display: {
    sql: `ALTER TABLE events
  ADD COLUMN IF NOT EXISTS during tsrange;

UPDATE events
   SET during = tsrange(ts::timestamp, (ts + interval '1 hour')::timestamp)
 WHERE during IS NULL;

CREATE INDEX IF NOT EXISTS events_during_gist
  ON events USING gist (during);

EXPLAIN
SELECT id, during
FROM events
WHERE during && tsrange(
  (now() - interval '10 days')::timestamp,
  (now() - interval '9 days')::timestamp
);`,
    drizzle: `import { sql } from 'drizzle-orm';

await db.execute(sql\`
  ALTER TABLE events ADD COLUMN IF NOT EXISTS during tsrange
\`);

await db.execute(sql\`
  UPDATE events
     SET during = tsrange(ts::timestamp, (ts + interval '1 hour')::timestamp)
   WHERE during IS NULL
\`);

await db.execute(sql\`
  CREATE INDEX IF NOT EXISTS events_during_gist
    ON events USING gist (during)
\`);

await db.execute(sql\`
  EXPLAIN
  SELECT id, during
  FROM events
  WHERE during && tsrange(
    (now() - interval '10 days')::timestamp,
    (now() - interval '9 days')::timestamp
  )
\`);`,
  },
  execute: async (db) => {
    await db.execute(sql`ALTER TABLE events ADD COLUMN IF NOT EXISTS during tsrange`);
    await db.execute(sql`
      UPDATE events
         SET during = tsrange(ts::timestamp, (ts + interval '1 hour')::timestamp)
       WHERE during IS NULL
    `);
    await db.execute(sql`CREATE INDEX IF NOT EXISTS events_during_gist ON events USING gist (during)`);
    return db.execute(sql`
      EXPLAIN
      SELECT id, during
      FROM events
      WHERE during && tsrange(
        (now() - interval '10 days')::timestamp,
        (now() - interval '9 days')::timestamp
      )
    `);
  },
};

export default example;
