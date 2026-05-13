import { sql } from 'drizzle-orm';
import type { ExampleDef } from '../../../types.ts';

const example: ExampleDef = {
  id: 'blocking-chain-shape',
  title: '每个 backend 被谁阻塞（多数为空数组）',
  support: 'partial',
  display: {
    sql: `SELECT pid,
       pg_blocking_pids(pid) AS blocked_by
FROM pg_stat_activity
WHERE datname = current_database()
ORDER BY pid;`,
    drizzle: `import { sql } from 'drizzle-orm';

await db.execute(sql\`
  SELECT pid,
         pg_blocking_pids(pid) AS blocked_by
  FROM pg_stat_activity
  WHERE datname = current_database()
  ORDER BY pid
\`);`,
  },
  execute: (db) =>
    db.execute(sql`
      SELECT pid,
             pg_blocking_pids(pid) AS blocked_by
      FROM pg_stat_activity
      WHERE datname = current_database()
      ORDER BY pid
    `),
};

export default example;
