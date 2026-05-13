import { sql } from 'drizzle-orm';
import type { ExampleDef } from '../../../types.ts';

const example: ExampleDef = {
  id: 'list-backend-procs',
  title: '查看当前所有 PG 进程',
  support: 'partial',
  display: {
    sql: `SELECT pid, backend_type, application_name
FROM pg_stat_activity
ORDER BY backend_type, pid;`,
    drizzle: `import { sql } from 'drizzle-orm';

await db.execute(sql\`
  SELECT pid, backend_type, application_name
  FROM pg_stat_activity
  ORDER BY backend_type, pid
\`);`,
  },
  execute: (db) =>
    db.execute(sql`
      SELECT pid, backend_type, application_name
      FROM pg_stat_activity
      ORDER BY backend_type, pid
    `),
};

export default example;
