import { sql } from 'drizzle-orm';
import type { ExampleDef } from '../../../types.ts';

const example: ExampleDef = {
  id: 'bool-three-values',
  title: 'boolean 三值逻辑：NULL = NULL → NULL',
  support: 'partial',
  display: {
    sql: `SELECT TRUE             AS t,
       FALSE            AS f,
       NULL::boolean    AS unknown,
       (NULL::boolean = NULL::boolean) AS null_eq_null,
       (NULL::boolean IS NULL)         AS null_is_null,
       (TRUE AND NULL::boolean)        AS true_and_null,
       (FALSE AND NULL::boolean)       AS false_and_null;`,
    drizzle: `import { sql } from 'drizzle-orm';

await db.execute(sql\`
  SELECT TRUE             AS t,
         FALSE            AS f,
         NULL::boolean    AS unknown,
         (NULL::boolean = NULL::boolean) AS null_eq_null,
         (NULL::boolean IS NULL)         AS null_is_null,
         (TRUE AND NULL::boolean)        AS true_and_null,
         (FALSE AND NULL::boolean)       AS false_and_null
\`);`,
  },
  execute: (db) =>
    db.execute(sql`
      SELECT TRUE             AS t,
             FALSE            AS f,
             NULL::boolean    AS unknown,
             (NULL::boolean = NULL::boolean) AS null_eq_null,
             (NULL::boolean IS NULL)         AS null_is_null,
             (TRUE AND NULL::boolean)        AS true_and_null,
             (FALSE AND NULL::boolean)       AS false_and_null
    `),
};

export default example;
