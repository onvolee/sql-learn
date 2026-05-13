import { sql } from 'drizzle-orm';
import type { ExampleDef } from '../../../types.ts';

const example: ExampleDef = {
  id: 'copy-to-stdout',
  title: 'COPY 导出（模拟为 SELECT 结果集）',
  support: 'partial',
  display: {
    sql: `-- 真实命令行使用方式（psql / pg_dump 客户端才能接收 STDOUT 流）：
-- \\copy (SELECT * FROM orders LIMIT 5) TO 'orders.csv' WITH (FORMAT csv)
--
-- 教学环境不接收 COPY 输出流，下面跑等价的 SELECT 看返回内容。
SELECT id, customer, amount
FROM orders
ORDER BY id
LIMIT 5;`,
    drizzle: `import { sql } from 'drizzle-orm';

// COPY ... TO STDOUT 是给 psql / pg_dump 之类客户端用的流式协议，
// 教学环境的 /exec 通道收不到流，用等价 SELECT 模拟结果集。
await db.execute(sql\`
  SELECT id, customer, amount
  FROM orders
  ORDER BY id
  LIMIT 5
\`);`,
  },
  execute: (db) =>
    db.execute(sql`
      SELECT id, customer, amount
      FROM orders
      ORDER BY id
      LIMIT 5
    `),
};

export default example;
