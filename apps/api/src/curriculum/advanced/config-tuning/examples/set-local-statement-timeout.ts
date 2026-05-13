import { sql } from 'drizzle-orm';
import type { ExampleDef } from '../../../types.ts';

const example: ExampleDef = {
  id: 'set-local-statement-timeout',
  title: 'SET LOCAL statement_timeout 触发 57014',
  support: 'partial',
  display: {
    sql: `-- 把单语句超时压到 100ms
SET LOCAL statement_timeout = '100ms';

-- 50ms 的 sleep 在阈值内，正常返回
SELECT pg_sleep(0.05);

-- 把上面这行换成 SELECT pg_sleep(0.2)，
-- 服务端会取消查询并返回 SQLSTATE 57014（query_canceled）`,
    drizzle: `import { sql } from 'drizzle-orm';

await db.execute(sql\`SET LOCAL statement_timeout = '100ms'\`);

// 50ms < 100ms，落在阈值内
return await db.execute(sql\`SELECT pg_sleep(0.05)\`);

// 把上面一行改成 sql\`SELECT pg_sleep(0.2)\` 期望抛出 57014 query_canceled`,
  },
  execute: async (db) => {
    await db.execute(sql`SET LOCAL statement_timeout = '100ms'`);
    return await db.execute(sql`SELECT pg_sleep(0.05)`);
  },
};

export default example;
