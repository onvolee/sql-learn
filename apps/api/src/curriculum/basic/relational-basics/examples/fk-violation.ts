import type { ExampleDef } from '../../../types.ts';
import { books } from '../schema.ts';

const example: ExampleDef = {
  id: 'fk-violation',
  title: '外键不存在 → SQLSTATE 23503',
  support: 'full',
  display: {
    sql: `INSERT INTO books (title, author_id, published_year)
VALUES ('Orphan Book', 999, 2024);
-- 期望失败：SQLSTATE 23503（foreign_key_violation）`,
    drizzle: `import { books } from './schema';

// 期望失败：SQLSTATE 23503（foreign_key_violation）
await db
  .insert(books)
  .values({ title: 'Orphan Book', authorId: 999, publishedYear: 2024 });`,
  },
  execute: (db) =>
    db
      .insert(books)
      .values({ title: 'Orphan Book', authorId: 999, publishedYear: 2024 }),
};

export default example;
