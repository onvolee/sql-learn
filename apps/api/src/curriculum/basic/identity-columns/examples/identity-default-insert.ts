import { sql } from 'drizzle-orm';
import type { ExampleDef } from '../../../types.ts';
import { tIdentity } from '../schema.ts';

const example: ExampleDef = {
  id: 'identity-default-insert',
  title: 'IDENTITY：不传 id 自动生成',
  support: 'partial',
  display: {
    sql: `INSERT INTO t_identity (name)
VALUES ('row-' || floor(random() * 10000)::text)
RETURNING id, name;`,
    drizzle: `import { sql } from 'drizzle-orm';
import { tIdentity } from './schema';

// drizzle 0.45 对 IDENTITY 列的 INSERT 仍要求显式声明列；
// 这里用 sql 模板直接表达对应的写法
await db.execute(sql\`
  INSERT INTO t_identity (name)
  VALUES ('row-' || floor(random() * 10000)::text)
  RETURNING id, name
\`);`,
  },
  execute: (db) =>
    db.execute(sql`
      INSERT INTO t_identity (name)
      VALUES ('row-' || floor(random() * 10000)::text)
      RETURNING id, name
    `),
};

export default example;
