import { sql } from 'drizzle-orm';
import type { ExampleDef } from '../../../types.ts';

const example: ExampleDef = {
  id: 'row-lock-for-update',
  title: 'SELECT ... FOR UPDATE 显式锁行',
  support: 'partial',
  display: {
    sql: `-- FOR UPDATE 在本事务结束前独占该行的写锁。
-- 框架的事务在 example 返回后自动 COMMIT，锁随即释放。

SELECT id, owner, balance
FROM accounts
WHERE id = 1
FOR UPDATE;
-- 期望返回 Alice 一行；该行此刻被本事务持有 ROW EXCLUSIVE 锁`,
    drizzle: `import { eq } from 'drizzle-orm';
import { accounts } from './schema';

await db
  .select({ id: accounts.id, owner: accounts.owner, balance: accounts.balance })
  .from(accounts)
  .where(eq(accounts.id, 1))
  .for('update');`,
  },
  execute: (db) =>
    db.execute(sql`
      SELECT id, owner, balance
      FROM accounts
      WHERE id = 1
      FOR UPDATE
    `),
};

export default example;
