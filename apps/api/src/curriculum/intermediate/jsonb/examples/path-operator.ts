import { sql } from 'drizzle-orm';
import type { ExampleDef } from '../../../types.ts';
import { docs } from '../schema.ts';

const example: ExampleDef = {
  id: 'path-operator',
  title: '#> 与 #>> 按路径取值',
  support: 'partial',
  display: {
    sql: `SELECT
  id,
  body #>  '{author,name}'   AS author_name_jsonb,
  body #>> '{author,name}'   AS author_name_text,
  body #>  '{tags,0}'        AS first_tag_jsonb,
  body #>> '{stats,views}'   AS views_text
FROM docs
ORDER BY id
LIMIT 4;`,
    drizzle: `import { sql } from 'drizzle-orm';
import { docs } from './schema';

await db.execute(sql\`
  SELECT
    id,
    body #>  '{author,name}'   AS author_name_jsonb,
    body #>> '{author,name}'   AS author_name_text,
    body #>  '{tags,0}'        AS first_tag_jsonb,
    body #>> '{stats,views}'   AS views_text
  FROM \${docs}
  ORDER BY id
  LIMIT 4
\`);`,
  },
  execute: (db) =>
    db.execute(sql`
      SELECT
        id,
        body #>  '{author,name}'   AS author_name_jsonb,
        body #>> '{author,name}'   AS author_name_text,
        body #>  '{tags,0}'        AS first_tag_jsonb,
        body #>> '{stats,views}'   AS views_text
      FROM ${docs}
      ORDER BY id
      LIMIT 4
    `),
};

export default example;
