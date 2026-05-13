import { sql } from 'drizzle-orm';
import type { ExampleDef } from '../../../types.ts';
import { users } from '../schema.ts';

const example: ExampleDef = {
  id: 'generated-column-read',
  title: '读取 GENERATED 列 age_group',
  support: 'partial',
  display: {
    sql: `SELECT id, name, age, age_group
FROM users
ORDER BY id;`,
    drizzle: `import { sql } from 'drizzle-orm';
import { users } from './schema';

// drizzle 0.45 对 generatedAlwaysAs 列读出来正常，
// 这里走 sql 模板更直白展示 GENERATED 行为。
await db.execute(sql\`
  SELECT id, name, age, age_group
  FROM \${users}
  ORDER BY id
\`);`,
  },
  execute: (db) =>
    db.execute(sql`
      SELECT id, name, age, age_group
      FROM ${users}
      ORDER BY id
    `),
};

export default example;
