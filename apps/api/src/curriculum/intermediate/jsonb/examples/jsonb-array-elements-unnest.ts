import { sql } from 'drizzle-orm';
import type { ExampleDef } from '../../../types.ts';
import { docs } from '../schema.ts';

const example: ExampleDef = {
  id: 'jsonb-array-elements-unnest',
  title: 'jsonb_array_elements_text 把 tags 拆成行',
  support: 'partial',
  display: {
    sql: `SELECT d.id, d.title, t AS tag
FROM docs d,
     jsonb_array_elements_text(d.body -> 'tags') t
ORDER BY d.id, tag
LIMIT 12;`,
    drizzle: `import { sql } from 'drizzle-orm';
import { docs } from './schema';

await db.execute(sql\`
  SELECT d.id, d.title, t AS tag
  FROM \${docs} d,
       jsonb_array_elements_text(d.body -> 'tags') t
  ORDER BY d.id, tag
  LIMIT 12
\`);`,
  },
  execute: (db) =>
    db.execute(sql`
      SELECT d.id, d.title, t AS tag
      FROM ${docs} d,
           jsonb_array_elements_text(d.body -> 'tags') t
      ORDER BY d.id, tag
      LIMIT 12
    `),
};

export default example;
