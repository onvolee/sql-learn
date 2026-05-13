import { sql } from 'drizzle-orm';
import type { ExampleDef } from '../../../types.ts';
import { users } from '../schema.ts';

const example: ExampleDef = {
  id: 'array-unnest',
  title: 'unnest 把数组展开成多行',
  support: 'partial',
  display: {
    sql: `SELECT u.name, t AS tag
FROM users u, unnest(u.tags) t
ORDER BY u.id, tag;`,
    drizzle: `import { sql } from 'drizzle-orm';
import { users } from './schema';

await db.execute(sql\`
  SELECT u.name, t AS tag
  FROM \${users} u, unnest(u.tags) t
  ORDER BY u.id, tag
\`);`,
  },
  execute: (db) =>
    db.execute(sql`
      SELECT u.name, t AS tag
      FROM ${users} u, unnest(u.tags) t
      ORDER BY u.id, tag
    `),
};

export default example;
