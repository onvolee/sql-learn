import { sql } from 'drizzle-orm';
import type { ExampleDef } from '../../../types.ts';

const example: ExampleDef = {
  id: 'inspect-pg-locks',
  title: '查 pg_locks 看本事务持有的锁',
  support: 'partial',
  display: {
    sql: `-- 先用事务级咨询锁制造一条可见的锁记录（事务结束自动释放），
-- 再查 pg_locks 限定到本会话。

SELECT pg_advisory_xact_lock(99);

SELECT locktype, mode, granted, objid
FROM pg_locks
WHERE pid = pg_backend_pid()
  AND locktype = 'advisory'
ORDER BY objid;
-- 期望至少返回一行：locktype='advisory', granted=true, objid=99`,
    drizzle: `import { sql } from 'drizzle-orm';

await db.execute(sql\`
  SELECT pg_advisory_xact_lock(99);
  SELECT locktype, mode, granted, objid
  FROM pg_locks
  WHERE pid = pg_backend_pid()
    AND locktype = 'advisory'
  ORDER BY objid
\`);`,
  },
  execute: (db) =>
    db.execute(sql`
      SELECT pg_advisory_xact_lock(99);
      SELECT locktype, mode, granted, objid
      FROM pg_locks
      WHERE pid = pg_backend_pid()
        AND locktype = 'advisory'
      ORDER BY objid
    `),
};

export default example;
