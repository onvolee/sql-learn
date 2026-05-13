import { sql } from 'drizzle-orm';
import type { ExampleDef } from '../../../types.ts';

const example: ExampleDef = {
  id: 'set-isolation-repeatable-read',
  title: '本事务切到 REPEATABLE READ',
  support: 'partial',
  display: {
    sql: `-- SET TRANSACTION 只影响当前事务，事务结束自动恢复。
-- 注意：该语句必须在事务里第一条数据访问之前执行，
-- 这里框架的 SET LOCAL search_path 已经发生过，所以紧跟一条新的查询即可。
SET TRANSACTION ISOLATION LEVEL REPEATABLE READ;

SELECT current_setting('transaction_isolation') AS isolation;
-- 期望返回 'repeatable read'`,
    drizzle: `import { sql } from 'drizzle-orm';

await db.execute(sql\`
  SET TRANSACTION ISOLATION LEVEL REPEATABLE READ;
  SELECT current_setting('transaction_isolation') AS isolation
\`);`,
  },
  execute: (db) =>
    db.execute(sql`
      SET TRANSACTION ISOLATION LEVEL REPEATABLE READ;
      SELECT current_setting('transaction_isolation') AS isolation
    `),
};

export default example;
