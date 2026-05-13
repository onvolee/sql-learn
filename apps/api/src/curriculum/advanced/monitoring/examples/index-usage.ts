import { sql } from 'drizzle-orm';
import type { ExampleDef } from '../../../types.ts';

const example: ExampleDef = {
  id: 'index-usage',
  title: '本 schema 索引被用了几次',
  support: 'partial',
  display: {
    sql: `SELECT indexrelname,
       idx_scan,
       idx_tup_read,
       idx_tup_fetch
FROM pg_stat_user_indexes
WHERE schemaname = 'm_monitoring'
ORDER BY indexrelname;`,
    drizzle: `import { sql } from 'drizzle-orm';

await db.execute(sql\`
  SELECT indexrelname,
         idx_scan,
         idx_tup_read,
         idx_tup_fetch
  FROM pg_stat_user_indexes
  WHERE schemaname = 'm_monitoring'
  ORDER BY indexrelname
\`);`,
  },
  execute: (db) =>
    db.execute(sql`
      SELECT indexrelname,
             idx_scan,
             idx_tup_read,
             idx_tup_fetch
      FROM pg_stat_user_indexes
      WHERE schemaname = 'm_monitoring'
      ORDER BY indexrelname
    `),
};

export default example;
