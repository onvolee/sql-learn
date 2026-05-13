import { sql } from 'drizzle-orm';
import type { ExampleDef } from '../../../types.ts';

const example: ExampleDef = {
  id: 'unused-index-candidates',
  title: 'idx_scan = 0 的死索引候选',
  support: 'partial',
  display: {
    sql: `SELECT indexrelname
FROM pg_stat_user_indexes
WHERE idx_scan = 0
  AND schemaname = 'm_monitoring'
ORDER BY indexrelname;`,
    drizzle: `import { sql } from 'drizzle-orm';

await db.execute(sql\`
  SELECT indexrelname
  FROM pg_stat_user_indexes
  WHERE idx_scan = 0
    AND schemaname = 'm_monitoring'
  ORDER BY indexrelname
\`);`,
  },
  execute: (db) =>
    db.execute(sql`
      SELECT indexrelname
      FROM pg_stat_user_indexes
      WHERE idx_scan = 0
        AND schemaname = 'm_monitoring'
      ORDER BY indexrelname
    `),
};

export default example;
