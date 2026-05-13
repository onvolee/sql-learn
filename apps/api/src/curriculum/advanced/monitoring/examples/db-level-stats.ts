import { sql } from 'drizzle-orm';
import type { ExampleDef } from '../../../types.ts';

const example: ExampleDef = {
  id: 'db-level-stats',
  title: '当前数据库的提交 / 回滚 / 命中计数',
  support: 'partial',
  display: {
    sql: `SELECT datname,
       xact_commit,
       xact_rollback,
       blks_hit,
       blks_read
FROM pg_stat_database
WHERE datname = current_database();`,
    drizzle: `import { sql } from 'drizzle-orm';

await db.execute(sql\`
  SELECT datname,
         xact_commit,
         xact_rollback,
         blks_hit,
         blks_read
  FROM pg_stat_database
  WHERE datname = current_database()
\`);`,
  },
  execute: (db) =>
    db.execute(sql`
      SELECT datname,
             xact_commit,
             xact_rollback,
             blks_hit,
             blks_read
      FROM pg_stat_database
      WHERE datname = current_database()
    `),
};

export default example;
