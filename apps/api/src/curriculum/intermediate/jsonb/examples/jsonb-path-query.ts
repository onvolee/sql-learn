import { sql } from 'drizzle-orm';
import type { ExampleDef } from '../../../types.ts';
import { docs } from '../schema.ts';

const example: ExampleDef = {
  id: 'jsonb-path-query',
  title: 'jsonb_path_query 抽取数组元素',
  support: 'partial',
  display: {
    sql: `SELECT
  id,
  jsonb_path_query(body, '$.tags[*]') AS tag
FROM docs
WHERE id = 1;`,
    drizzle: `import { sql } from 'drizzle-orm';
import { docs } from './schema';

await db.execute(sql\`
  SELECT
    id,
    jsonb_path_query(body, '$.tags[*]') AS tag
  FROM \${docs}
  WHERE id = 1
\`);`,
  },
  execute: (db) =>
    db.execute(sql`
      SELECT
        id,
        jsonb_path_query(body, '$.tags[*]') AS tag
      FROM ${docs}
      WHERE id = 1
    `),
};

export default example;
