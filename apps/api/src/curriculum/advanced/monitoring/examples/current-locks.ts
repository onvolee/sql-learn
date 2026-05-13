import { sql } from 'drizzle-orm';
import type { ExampleDef } from '../../../types.ts';

const example: ExampleDef = {
  id: 'current-locks',
  title: '本会话当前持有的锁',
  support: 'partial',
  display: {
    sql: `SELECT locktype,
       mode,
       granted,
       pid
FROM pg_locks
WHERE pid = pg_backend_pid()
ORDER BY locktype, mode;`,
    drizzle: `import { sql } from 'drizzle-orm';

await db.execute(sql\`
  SELECT locktype,
         mode,
         granted,
         pid
  FROM pg_locks
  WHERE pid = pg_backend_pid()
  ORDER BY locktype, mode
\`);`,
  },
  execute: (db) =>
    db.execute(sql`
      SELECT locktype,
             mode,
             granted,
             pid
      FROM pg_locks
      WHERE pid = pg_backend_pid()
      ORDER BY locktype, mode
    `),
};

export default example;
