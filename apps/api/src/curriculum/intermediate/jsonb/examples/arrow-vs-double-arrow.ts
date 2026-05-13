import { sql } from 'drizzle-orm';
import type { ExampleDef } from '../../../types.ts';
import { docs } from '../schema.ts';

const example: ExampleDef = {
  id: 'arrow-vs-double-arrow',
  title: '-> 得 jsonb，->> 得 text',
  support: 'partial',
  display: {
    sql: `SELECT
  id,
  body -> 'author'           AS author_jsonb,
  body -> 'author' ->> 'name' AS author_name,
  body ->> 'title'            AS title_text
FROM docs
ORDER BY id
LIMIT 3;`,
    drizzle: `import { sql } from 'drizzle-orm';
import { docs } from './schema';

await db.execute(sql\`
  SELECT
    id,
    body -> 'author'            AS author_jsonb,
    body -> 'author' ->> 'name' AS author_name,
    body ->> 'title'            AS title_text
  FROM \${docs}
  ORDER BY id
  LIMIT 3
\`);`,
  },
  execute: (db) =>
    db.execute(sql`
      SELECT
        id,
        body -> 'author'            AS author_jsonb,
        body -> 'author' ->> 'name' AS author_name,
        body ->> 'title'            AS title_text
      FROM ${docs}
      ORDER BY id
      LIMIT 3
    `),
};

export default example;
