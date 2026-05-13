import { sql } from 'drizzle-orm';
import type { ExampleDef } from '../../../types.ts';

const example: ExampleDef = {
  id: 'search-with-rank',
  title: 'ts_rank：按相关性排序',
  support: 'partial',
  display: {
    sql: `SELECT id, title, ts_rank(tsv, q) AS rank
FROM   articles, to_tsquery('english', 'index | vacuum') q
WHERE  tsv @@ q
ORDER BY rank DESC, id;`,
    drizzle: `import { sql } from 'drizzle-orm';

await db.execute(sql\`
  SELECT id, title, ts_rank(tsv, q) AS rank
  FROM   articles, to_tsquery('english', 'index | vacuum') q
  WHERE  tsv @@ q
  ORDER BY rank DESC, id
\`);`,
  },
  execute: (db) =>
    db.execute(sql`
      SELECT id, title, ts_rank(tsv, q) AS rank
      FROM   articles, to_tsquery('english', 'index | vacuum') q
      WHERE  tsv @@ q
      ORDER BY rank DESC, id
    `),
};

export default example;
