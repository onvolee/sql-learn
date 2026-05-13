import { sql } from 'drizzle-orm';
import type { ExampleDef } from '../../../types.ts';

const example: ExampleDef = {
  id: 'mvcc-update-creates-new-version',
  title: 'UPDATE 让 ctid 改变（新版本被搬到新位置）',
  support: 'partial',
  display: {
    sql: `-- 用 SAVEPOINT 包起来，演示完整事务内可见的 ctid 变化，
-- 末尾 ROLLBACK TO 把 balance 改回去，主表数据不动。

SAVEPOINT before_update;

-- 先看一眼当前版本
SELECT 'before' AS phase, id, balance, xmin, xmax, ctid
FROM accounts WHERE id = 1;

UPDATE accounts SET balance = balance + 1 WHERE id = 1;

-- 再看：xmin 变成本事务 txid，ctid 通常变成 (block, 新 offset)
SELECT 'after'  AS phase, id, balance, xmin, xmax, ctid
FROM accounts WHERE id = 1;

ROLLBACK TO SAVEPOINT before_update;
-- 收尾后主表保持 seed 余额`,
    drizzle: `import { sql } from 'drizzle-orm';

await db.execute(sql\`
  SAVEPOINT before_update;
  SELECT 'before' AS phase, id, balance, xmin, xmax, ctid
  FROM accounts WHERE id = 1;
  UPDATE accounts SET balance = balance + 1 WHERE id = 1;
  SELECT 'after'  AS phase, id, balance, xmin, xmax, ctid
  FROM accounts WHERE id = 1;
  ROLLBACK TO SAVEPOINT before_update
\`);`,
  },
  execute: (db) =>
    db.execute(sql`
      SAVEPOINT before_update;
      SELECT 'before' AS phase, id, balance, xmin, xmax, ctid
      FROM accounts WHERE id = 1;
      UPDATE accounts SET balance = balance + 1 WHERE id = 1;
      SELECT 'after'  AS phase, id, balance, xmin, xmax, ctid
      FROM accounts WHERE id = 1;
      ROLLBACK TO SAVEPOINT before_update
    `),
};

export default example;
