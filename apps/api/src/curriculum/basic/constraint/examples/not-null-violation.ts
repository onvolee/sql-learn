import { sql } from 'drizzle-orm';
import type { ExampleDef } from '../../../types.ts';

const example: ExampleDef = {
  id: 'not-null-violation',
  title: 'NOT NULL 列写入 NULL → SQLSTATE 23502',
  support: 'partial',
  display: {
    sql: `INSERT INTO orders (customer) VALUES (NULL);
-- 期望失败：SQLSTATE 23502（not_null_violation）
-- orders.customer 声明为 NOT NULL`,
    drizzle: `import { sql } from 'drizzle-orm';

// 期望失败：SQLSTATE 23502（not_null_violation）
// drizzle DSL 在类型层就禁止把 null 写入 notNull 列，
// 因此用 sql 模板触发底层错误。
await db.execute(sql\`
  INSERT INTO orders (customer) VALUES (NULL)
\`);`,
  },
  execute: (db) =>
    db.execute(sql`INSERT INTO orders (customer) VALUES (NULL)`),
};

export default example;
