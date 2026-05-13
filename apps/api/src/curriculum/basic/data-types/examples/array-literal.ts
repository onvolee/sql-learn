import { sql } from 'drizzle-orm';
import type { ExampleDef } from '../../../types.ts';

const example: ExampleDef = {
  id: 'array-literal',
  title: 'ARRAY[...] 字面量与长度',
  support: 'partial',
  display: {
    sql: `SELECT ARRAY['a', 'b', 'c']          AS strings,
       ARRAY[1, 2, 3]                  AS ints,
       array_length(ARRAY['a','b','c'], 1) AS len,
       pg_typeof(ARRAY['a','b'])       AS the_type;`,
    drizzle: `import { sql } from 'drizzle-orm';

await db.execute(sql\`
  SELECT ARRAY['a', 'b', 'c']          AS strings,
         ARRAY[1, 2, 3]                  AS ints,
         array_length(ARRAY['a','b','c'], 1) AS len,
         pg_typeof(ARRAY['a','b'])       AS the_type
\`);`,
  },
  execute: (db) =>
    db.execute(sql`
      SELECT ARRAY['a', 'b', 'c']          AS strings,
             ARRAY[1, 2, 3]                  AS ints,
             array_length(ARRAY['a','b','c'], 1) AS len,
             pg_typeof(ARRAY['a','b'])       AS the_type
    `),
};

export default example;
