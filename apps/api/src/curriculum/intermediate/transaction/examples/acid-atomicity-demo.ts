import { sql } from 'drizzle-orm';
import type { ExampleDef } from '../../../types.ts';

const example: ExampleDef = {
  id: 'acid-atomicity-demo',
  title: '原子性：中间步骤撤销，主表数据不变',
  support: 'partial',
  display: {
    sql: `-- 用 SAVEPOINT 演示一次"转账失败回滚"：
-- Alice → Bob 转 200，扣款已发生但入账尚未发生时回滚，主表数据维持原样。

SAVEPOINT before_transfer;

UPDATE accounts SET balance = balance - 200 WHERE id = 1;  -- Alice 扣款
-- 模拟入账前出错，整笔回滚
ROLLBACK TO SAVEPOINT before_transfer;

SELECT id, owner, balance FROM accounts
WHERE id IN (1, 2)
ORDER BY id;
-- 期望：Alice / Bob 的 balance 与 seed 一致（1000 / 1000）`,
    drizzle: `import { sql } from 'drizzle-orm';

await db.execute(sql\`
  SAVEPOINT before_transfer;
  UPDATE accounts SET balance = balance - 200 WHERE id = 1;
  ROLLBACK TO SAVEPOINT before_transfer;
  SELECT id, owner, balance FROM accounts
  WHERE id IN (1, 2)
  ORDER BY id
\`);`,
  },
  execute: (db) =>
    db.execute(sql`
      SAVEPOINT before_transfer;
      UPDATE accounts SET balance = balance - 200 WHERE id = 1;
      ROLLBACK TO SAVEPOINT before_transfer;
      SELECT id, owner, balance FROM accounts
      WHERE id IN (1, 2)
      ORDER BY id
    `),
};

export default example;
