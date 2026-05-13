import { sql } from 'drizzle-orm';
import type { ExampleDef } from '../../../types.ts';

const example: ExampleDef = {
  id: 'range-literal',
  title: 'int4range 范围字面量',
  support: 'partial',
  display: {
    sql: `SELECT int4range(1, 10)               AS half_open,
       int4range(1, 10, '[]')          AS closed,
       lower(int4range(1, 10))          AS lo,
       upper(int4range(1, 10))          AS hi,
       int4range(1, 10) @> 5            AS contains_5,
       int4range(1, 10) @> 10           AS contains_10;`,
    drizzle: `import { sql } from 'drizzle-orm';

await db.execute(sql\`
  SELECT int4range(1, 10)               AS half_open,
         int4range(1, 10, '[]')          AS closed,
         lower(int4range(1, 10))          AS lo,
         upper(int4range(1, 10))          AS hi,
         int4range(1, 10) @> 5            AS contains_5,
         int4range(1, 10) @> 10           AS contains_10
\`);`,
  },
  execute: (db) =>
    db.execute(sql`
      SELECT int4range(1, 10)               AS half_open,
             int4range(1, 10, '[]')          AS closed,
             lower(int4range(1, 10))          AS lo,
             upper(int4range(1, 10))          AS hi,
             int4range(1, 10) @> 5            AS contains_5,
             int4range(1, 10) @> 10           AS contains_10
    `),
};

export default example;
