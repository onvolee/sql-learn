import { sql } from 'drizzle-orm';
import type { ExampleDef } from '../../../types.ts';

const example: ExampleDef = {
  id: 'advisory-lock-acquire-release',
  title: '咨询锁：获取 + 释放',
  support: 'partial',
  display: {
    sql: `-- 会话级咨询锁需要显式 unlock，否则锁会跟着连接活下去。
-- pg_advisory_lock 返回 void，pg_advisory_unlock 返回 boolean。

SELECT pg_advisory_lock(42)    AS locked;     -- 拿到锁（阻塞直到可用）
SELECT pg_advisory_unlock(42)  AS unlocked;   -- 释放，期望返回 true`,
    drizzle: `import { sql } from 'drizzle-orm';

await db.execute(sql\`
  SELECT pg_advisory_lock(42)    AS locked;
  SELECT pg_advisory_unlock(42)  AS unlocked
\`);`,
  },
  execute: (db) =>
    db.execute(sql`
      SELECT pg_advisory_lock(42)    AS locked;
      SELECT pg_advisory_unlock(42)  AS unlocked
    `),
};

export default example;
