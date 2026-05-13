import { sql } from 'drizzle-orm';
import type { ExampleDef } from '../../../types.ts';

const example: ExampleDef = {
  id: 'current-activity',
  title: '当前数据库上的所有 backend',
  support: 'partial',
  display: {
    sql: `SELECT pid,
       state,
       query
FROM pg_stat_activity
WHERE datname = current_database()
ORDER BY pid;`,
    drizzle: `import { sql } from 'drizzle-orm';

await db.execute(sql\`
  SELECT pid,
         state,
         query
  FROM pg_stat_activity
  WHERE datname = current_database()
  ORDER BY pid
\`);`,
  },
  execute: (db) =>
    db.execute(sql`
      SELECT pid,
             state,
             query
      FROM pg_stat_activity
      WHERE datname = current_database()
      ORDER BY pid
    `),
};

export default example;
