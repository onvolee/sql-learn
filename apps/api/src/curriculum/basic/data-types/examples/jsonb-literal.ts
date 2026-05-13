import { sql } from 'drizzle-orm';
import type { ExampleDef } from '../../../types.ts';

const example: ExampleDef = {
  id: 'jsonb-literal',
  title: 'jsonb 字面量与基本形态',
  support: 'partial',
  display: {
    sql: `SELECT '{"k": 1, "v": [1, 2]}'::jsonb AS obj,
       '[1, 2, 3]'::jsonb              AS arr,
       '"plain string"'::jsonb         AS scalar,
       pg_typeof('{}'::jsonb)          AS the_type;`,
    drizzle: `import { sql } from 'drizzle-orm';

await db.execute(sql\`
  SELECT '{"k": 1, "v": [1, 2]}'::jsonb AS obj,
         '[1, 2, 3]'::jsonb              AS arr,
         '"plain string"'::jsonb         AS scalar,
         pg_typeof('{}'::jsonb)          AS the_type
\`);`,
  },
  execute: (db) =>
    db.execute(sql`
      SELECT '{"k": 1, "v": [1, 2]}'::jsonb AS obj,
             '[1, 2, 3]'::jsonb              AS arr,
             '"plain string"'::jsonb         AS scalar,
             pg_typeof('{}'::jsonb)          AS the_type
    `),
};

export default example;
