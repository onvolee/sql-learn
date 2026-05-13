import { sql } from 'drizzle-orm';
import type { ExampleDef } from '../../../types.ts';

const example: ExampleDef = {
  id: 'deadlock-timeout-setting',
  title: 'SHOW deadlock_timeout',
  support: 'partial',
  display: {
    sql: `SHOW deadlock_timeout;
-- 期望返回默认 '1s'：PG 在等待锁超过这个时间后才扫等待图找环
-- 本课程框架无法演示真死锁（需 2 个连接），这里只看配置`,
    drizzle: `import { sql } from 'drizzle-orm';

await db.execute(sql\`SHOW deadlock_timeout\`);`,
  },
  execute: (db) => db.execute(sql`SHOW deadlock_timeout`),
};

export default example;
