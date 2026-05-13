import { sql } from 'drizzle-orm';
import type { ExampleDef } from '../../../types.ts';

const example: ExampleDef = {
  id: 'mvcc-inspect-xmin',
  title: '查看 xmin / xmax / ctid',
  support: 'partial',
  display: {
    sql: `SELECT id, owner, balance, xmin, xmax, ctid
FROM accounts
ORDER BY id;
-- xmin: 创建该版本的事务 ID
-- xmax: 删除该版本的事务 ID（0 = 仍是最新）
-- ctid: 物理位置 (block, offset)`,
    drizzle: `import { sql } from 'drizzle-orm';

await db.execute(sql\`
  SELECT id, owner, balance, xmin, xmax, ctid
  FROM accounts
  ORDER BY id
\`);`,
  },
  execute: (db) =>
    db.execute(sql`
      SELECT id, owner, balance, xmin, xmax, ctid
      FROM accounts
      ORDER BY id
    `),
};

export default example;
