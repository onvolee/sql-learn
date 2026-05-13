import { sql } from 'drizzle-orm';
import type { ExampleDef } from '../../../types.ts';

const example: ExampleDef = {
  id: 'match-operator',
  title: '@@：tsvector 与 tsquery 匹配',
  support: 'partial',
  display: {
    sql: `SELECT
  to_tsvector('english', 'A quick brown fox jumps over the lazy dog')
    @@ to_tsquery('english', 'quick & fox')   AS hit_quick_fox,
  to_tsvector('english', 'A quick brown fox jumps over the lazy dog')
    @@ to_tsquery('english', 'cat | mouse')   AS hit_cat_mouse;`,
    drizzle: `import { sql } from 'drizzle-orm';

await db.execute(sql\`
  SELECT
    to_tsvector('english', 'A quick brown fox jumps over the lazy dog')
      @@ to_tsquery('english', 'quick & fox')   AS hit_quick_fox,
    to_tsvector('english', 'A quick brown fox jumps over the lazy dog')
      @@ to_tsquery('english', 'cat | mouse')   AS hit_cat_mouse
\`);`,
  },
  execute: (db) =>
    db.execute(sql`
      SELECT
        to_tsvector('english', 'A quick brown fox jumps over the lazy dog')
          @@ to_tsquery('english', 'quick & fox')   AS hit_quick_fox,
        to_tsvector('english', 'A quick brown fox jumps over the lazy dog')
          @@ to_tsquery('english', 'cat | mouse')   AS hit_cat_mouse
    `),
};

export default example;
