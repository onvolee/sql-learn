import { sql } from 'drizzle-orm';
import type { ExampleDef } from '../../../types.ts';

const example: ExampleDef = {
  id: 'inspect-index-size',
  title: '本模块所有索引的大小',
  support: 'partial',
  display: {
    sql: `SELECT indexrelname              AS index_name,
       relname                   AS table_name,
       pg_size_pretty(pg_relation_size(indexrelid)) AS index_size,
       idx_scan,
       idx_tup_read,
       idx_tup_fetch
FROM pg_stat_user_indexes
WHERE schemaname = 'm_vacuum'
ORDER BY pg_relation_size(indexrelid) DESC;`,
    drizzle: `import { sql } from 'drizzle-orm';

await db.execute(sql\`
  SELECT indexrelname              AS index_name,
         relname                   AS table_name,
         pg_size_pretty(pg_relation_size(indexrelid)) AS index_size,
         idx_scan,
         idx_tup_read,
         idx_tup_fetch
  FROM pg_stat_user_indexes
  WHERE schemaname = 'm_vacuum'
  ORDER BY pg_relation_size(indexrelid) DESC
\`);`,
  },
  execute: (db) =>
    db.execute(sql`
      SELECT indexrelname              AS index_name,
             relname                   AS table_name,
             pg_size_pretty(pg_relation_size(indexrelid)) AS index_size,
             idx_scan,
             idx_tup_read,
             idx_tup_fetch
      FROM pg_stat_user_indexes
      WHERE schemaname = 'm_vacuum'
      ORDER BY pg_relation_size(indexrelid) DESC
    `),
};

export default example;
