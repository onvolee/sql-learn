import type { ExampleDef } from '../../../types.ts';
import { authors } from '../schema.ts';

const example: ExampleDef = {
  id: 'pk-violation',
  title: '主键重复 → SQLSTATE 23505',
  support: 'full',
  display: {
    sql: `INSERT INTO authors (id, name, country)
VALUES (1, 'duplicate', 'X');
-- 期望失败：SQLSTATE 23505（unique_violation）`,
    drizzle: `import { authors } from './schema';

// 期望失败：SQLSTATE 23505（unique_violation）
await db
  .insert(authors)
  .values({ id: 1, name: 'duplicate', country: 'X' });`,
  },
  execute: (db) =>
    db
      .insert(authors)
      .values({ id: 1, name: 'duplicate', country: 'X' }),
};

export default example;
