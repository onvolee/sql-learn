import { sql } from 'drizzle-orm';
import type { ExampleDef } from '../../../types.ts';
import { users } from '../schema.ts';

const example: ExampleDef = {
  id: 'array-operators',
  title: '数组操作符 @> 与 &&',
  support: 'partial',
  display: {
    sql: `SELECT id, name, tags
FROM users
WHERE tags @> ARRAY['admin']         -- 包含 'admin'
   OR tags && ARRAY['vip','beta'];   -- 与 ['vip','beta'] 有交集`,
    drizzle: `import { sql } from 'drizzle-orm';
import { users } from './schema';

await db.execute(sql\`
  SELECT id, name, tags
  FROM \${users}
  WHERE tags @> ARRAY['admin']
     OR tags && ARRAY['vip','beta']
\`);`,
  },
  execute: (db) =>
    db.execute(sql`
      SELECT id, name, tags
      FROM ${users}
      WHERE tags @> ARRAY['admin']
         OR tags && ARRAY['vip','beta']
    `),
};

export default example;
