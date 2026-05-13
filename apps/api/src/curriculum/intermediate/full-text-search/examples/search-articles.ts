import { sql } from 'drizzle-orm';
import type { ExampleDef } from '../../../types.ts';

const example: ExampleDef = {
  id: 'search-articles',
  title: 'WHERE tsv @@ to_tsquery 检索 articles',
  support: 'partial',
  display: {
    sql: `SELECT id, title
FROM   articles
WHERE  tsv @@ to_tsquery('english', 'postgres & index')
ORDER BY id;`,
    drizzle: `import { sql } from 'drizzle-orm';

await db.execute(sql\`
  SELECT id, title
  FROM   articles
  WHERE  tsv @@ to_tsquery('english', 'postgres & index')
  ORDER BY id
\`);`,
  },
  execute: (db) =>
    db.execute(sql`
      SELECT id, title
      FROM   articles
      WHERE  tsv @@ to_tsquery('english', 'postgres & index')
      ORDER BY id
    `),
};

export default example;
