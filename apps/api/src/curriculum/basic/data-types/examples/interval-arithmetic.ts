import { sql } from 'drizzle-orm';
import type { ExampleDef } from '../../../types.ts';

const example: ExampleDef = {
  id: 'interval-arithmetic',
  title: 'interval 与时间点加减',
  support: 'partial',
  display: {
    sql: `SELECT now()                       AS right_now,
       now() + interval '7 days'    AS plus_seven_days,
       now() - interval '1 month'   AS one_month_ago,
       date '2026-01-01' + interval '90 minutes' AS d_plus_90m,
       interval '2 hours' + interval '30 minutes' AS combined;`,
    drizzle: `import { sql } from 'drizzle-orm';

await db.execute(sql\`
  SELECT now()                       AS right_now,
         now() + interval '7 days'    AS plus_seven_days,
         now() - interval '1 month'   AS one_month_ago,
         date '2026-01-01' + interval '90 minutes' AS d_plus_90m,
         interval '2 hours' + interval '30 minutes' AS combined
\`);`,
  },
  execute: (db) =>
    db.execute(sql`
      SELECT now()                       AS right_now,
             now() + interval '7 days'    AS plus_seven_days,
             now() - interval '1 month'   AS one_month_ago,
             date '2026-01-01' + interval '90 minutes' AS d_plus_90m,
             interval '2 hours' + interval '30 minutes' AS combined
    `),
};

export default example;
