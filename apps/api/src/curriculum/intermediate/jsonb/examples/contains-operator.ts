import { sql } from 'drizzle-orm';
import type { ExampleDef } from '../../../types.ts';
import { docs } from '../schema.ts';

const example: ExampleDef = {
  id: 'contains-operator',
  title: '@> 包含查询（tag = sql）',
  support: 'partial',
  display: {
    sql: `SELECT id, title, body -> 'tags' AS tags
FROM docs
WHERE body @> '{"tags": ["sql"]}'
ORDER BY id;`,
    drizzle: `import { sql } from 'drizzle-orm';
import { docs } from './schema';

await db.execute(sql\`
  SELECT id, title, body -> 'tags' AS tags
  FROM \${docs}
  WHERE body @> '{"tags": ["sql"]}'
  ORDER BY id
\`);`,
  },
  execute: (db) =>
    db.execute(sql`
      SELECT id, title, body -> 'tags' AS tags
      FROM ${docs}
      WHERE body @> '{"tags": ["sql"]}'
      ORDER BY id
    `),
};

export default example;
