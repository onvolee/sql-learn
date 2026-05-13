import { sql } from 'drizzle-orm';
import type { ExampleDef } from '../../../types.ts';

const example: ExampleDef = {
  id: 'savepoint-release',
  title: 'RELEASE SAVEPOINT：丢名字，留更改',
  support: 'partial',
  display: {
    sql: `-- RELEASE SAVEPOINT 只是丢弃这个保存点名字，
-- 它之后的更改并不撤销——只是「之后不能再 ROLLBACK TO sp1 了」。
-- 末尾整个回滚到 outer_sp 把演示对主表的影响清掉。

SAVEPOINT outer_sp;

SAVEPOINT sp1;
UPDATE accounts SET balance = balance + 10 WHERE id = 3;
RELEASE SAVEPOINT sp1;
-- sp1 已丢，但 +10 仍然在当前事务里

-- 看一眼当前事务内能查到的余额（含 +10）
SELECT id, owner, balance FROM accounts WHERE id = 3;

-- 收尾：整个回滚到 outer_sp，主表保持 seed 状态
ROLLBACK TO SAVEPOINT outer_sp;`,
    drizzle: `import { sql } from 'drizzle-orm';

await db.execute(sql\`
  SAVEPOINT outer_sp;
  SAVEPOINT sp1;
  UPDATE accounts SET balance = balance + 10 WHERE id = 3;
  RELEASE SAVEPOINT sp1;
  SELECT id, owner, balance FROM accounts WHERE id = 3;
  ROLLBACK TO SAVEPOINT outer_sp
\`);`,
  },
  execute: (db) =>
    db.execute(sql`
      SAVEPOINT outer_sp;
      SAVEPOINT sp1;
      UPDATE accounts SET balance = balance + 10 WHERE id = 3;
      RELEASE SAVEPOINT sp1;
      SELECT id, owner, balance FROM accounts WHERE id = 3;
      ROLLBACK TO SAVEPOINT outer_sp
    `),
};

export default example;
