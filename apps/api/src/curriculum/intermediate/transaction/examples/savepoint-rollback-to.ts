import { sql } from 'drizzle-orm';
import type { ExampleDef } from '../../../types.ts';

const example: ExampleDef = {
  id: 'savepoint-rollback-to',
  title: 'SAVEPOINT + ROLLBACK TO：只撤一半',
  support: 'partial',
  display: {
    sql: `-- 三步操作，中间设保存点，最后回滚到保存点：
-- 第一步保留，第二、三步被撤销。

SAVEPOINT sp1;

UPDATE accounts SET balance = balance + 50 WHERE id = 3;  -- 这一步会保留？取决于 sp 位置
SAVEPOINT sp2;

UPDATE accounts SET balance = balance + 100 WHERE id = 3; -- sp2 后，被回滚
UPDATE accounts SET balance = balance + 100 WHERE id = 4; -- sp2 后，被回滚

ROLLBACK TO SAVEPOINT sp2;
-- 回到 sp2 那一刻：id=3 已 +50，id=4 没变
-- 然后再回滚到 sp1，连那 +50 也撤掉
ROLLBACK TO SAVEPOINT sp1;

SELECT id, owner, balance FROM accounts
WHERE id IN (3, 4)
ORDER BY id;
-- 期望：与 seed 一致（Carol 100 / Dave 0）`,
    drizzle: `import { sql } from 'drizzle-orm';

await db.execute(sql\`
  SAVEPOINT sp1;
  UPDATE accounts SET balance = balance + 50 WHERE id = 3;
  SAVEPOINT sp2;
  UPDATE accounts SET balance = balance + 100 WHERE id = 3;
  UPDATE accounts SET balance = balance + 100 WHERE id = 4;
  ROLLBACK TO SAVEPOINT sp2;
  ROLLBACK TO SAVEPOINT sp1;
  SELECT id, owner, balance FROM accounts
  WHERE id IN (3, 4)
  ORDER BY id
\`);`,
  },
  execute: (db) =>
    db.execute(sql`
      SAVEPOINT sp1;
      UPDATE accounts SET balance = balance + 50 WHERE id = 3;
      SAVEPOINT sp2;
      UPDATE accounts SET balance = balance + 100 WHERE id = 3;
      UPDATE accounts SET balance = balance + 100 WHERE id = 4;
      ROLLBACK TO SAVEPOINT sp2;
      ROLLBACK TO SAVEPOINT sp1;
      SELECT id, owner, balance FROM accounts
      WHERE id IN (3, 4)
      ORDER BY id
    `),
};

export default example;
