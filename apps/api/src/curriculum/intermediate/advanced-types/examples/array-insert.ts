import type { ExampleDef } from '../../../types.ts';
import { users } from '../schema.ts';

const example: ExampleDef = {
  id: 'array-insert',
  title: '插入带数组列的行',
  support: 'full',
  display: {
    sql: `INSERT INTO users (name, age, tags)
VALUES ('gina', 28, ARRAY['admin', 'beta'])
RETURNING id, name, tags;`,
    drizzle: `import { users } from './schema';

await db
  .insert(users)
  .values({ name: 'gina', age: 28, tags: ['admin', 'beta'] })
  .returning({ id: users.id, name: users.name, tags: users.tags });`,
  },
  execute: (db) =>
    db
      .insert(users)
      .values({ name: 'gina', age: 28, tags: ['admin', 'beta'] })
      .returning({ id: users.id, name: users.name, tags: users.tags }),
};

export default example;
