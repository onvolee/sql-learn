import { sql } from 'drizzle-orm';
import type { ExampleDef } from '../../../types.ts';

// 对比 btree (events_ts_idx) 与 brin (events_ts_brin) 的体积。
// 如果两个索引还没建（依赖前面 example 运行），这里用 IF NOT EXISTS 自包含。
const example: ExampleDef = {
  id: 'brin-vs-btree-size',
  title: 'BRIN vs B-tree 索引体积对比',
  support: 'partial',
  timeoutMs: 30000,
  display: {
    sql: `CREATE INDEX IF NOT EXISTS events_ts_idx  ON events (ts);
CREATE INDEX IF NOT EXISTS events_ts_brin ON events USING brin (ts);

SELECT
  'btree' AS kind,
  pg_size_pretty(pg_relation_size('events_ts_idx'))  AS size
UNION ALL
SELECT
  'brin'  AS kind,
  pg_size_pretty(pg_relation_size('events_ts_brin')) AS size;`,
    drizzle: `import { sql } from 'drizzle-orm';

await db.execute(sql\`CREATE INDEX IF NOT EXISTS events_ts_idx  ON events (ts)\`);
await db.execute(sql\`CREATE INDEX IF NOT EXISTS events_ts_brin ON events USING brin (ts)\`);

await db.execute(sql\`
  SELECT 'btree' AS kind, pg_size_pretty(pg_relation_size('events_ts_idx'))  AS size
  UNION ALL
  SELECT 'brin'  AS kind, pg_size_pretty(pg_relation_size('events_ts_brin')) AS size
\`);`,
  },
  execute: async (db) => {
    await db.execute(sql`CREATE INDEX IF NOT EXISTS events_ts_idx ON events (ts)`);
    await db.execute(sql`CREATE INDEX IF NOT EXISTS events_ts_brin ON events USING brin (ts)`);
    return db.execute(sql`
      SELECT 'btree' AS kind, pg_size_pretty(pg_relation_size('events_ts_idx'))  AS size
      UNION ALL
      SELECT 'brin'  AS kind, pg_size_pretty(pg_relation_size('events_ts_brin')) AS size
    `);
  },
};

export default example;
