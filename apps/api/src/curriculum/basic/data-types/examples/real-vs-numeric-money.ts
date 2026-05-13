import { sql } from 'drizzle-orm';
import type { ExampleDef } from '../../../types.ts';

const example: ExampleDef = {
  id: 'real-vs-numeric-money',
  title: 'real 浮点误差 vs numeric 精确',
  support: 'partial',
  display: {
    sql: `SELECT 0.1::real    + 0.2::real    AS real_sum,
       0.1::numeric + 0.2::numeric AS numeric_sum,
       (0.1::real    + 0.2::real)    = 0.3::real    AS real_eq_03,
       (0.1::numeric + 0.2::numeric) = 0.3::numeric AS numeric_eq_03;`,
    drizzle: `import { sql } from 'drizzle-orm';

await db.execute(sql\`
  SELECT 0.1::real    + 0.2::real    AS real_sum,
         0.1::numeric + 0.2::numeric AS numeric_sum,
         (0.1::real    + 0.2::real)    = 0.3::real    AS real_eq_03,
         (0.1::numeric + 0.2::numeric) = 0.3::numeric AS numeric_eq_03
\`);`,
  },
  execute: (db) =>
    db.execute(sql`
      SELECT 0.1::real    + 0.2::real    AS real_sum,
             0.1::numeric + 0.2::numeric AS numeric_sum,
             (0.1::real    + 0.2::real)    = 0.3::real    AS real_eq_03,
             (0.1::numeric + 0.2::numeric) = 0.3::numeric AS numeric_eq_03
    `),
};

export default example;
