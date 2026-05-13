import { sql } from 'drizzle-orm';
import type { ExampleDef } from '../../../types.ts';

const example: ExampleDef = {
  id: 'fn-call',
  title: '调用 fn_region_total(east)',
  support: 'partial',
  display: {
    sql: `SELECT fn_region_total('east') AS east_total,
       fn_region_total('west') AS west_total,
       fn_region_total('north') AS north_total;`,
    drizzle: `import { sql } from 'drizzle-orm';

await db.execute(sql\`
  SELECT fn_region_total('east')  AS east_total,
         fn_region_total('west')  AS west_total,
         fn_region_total('north') AS north_total
\`);`,
  },
  execute: (db) =>
    db.execute(sql`
      SELECT fn_region_total('east')  AS east_total,
             fn_region_total('west')  AS west_total,
             fn_region_total('north') AS north_total
    `),
};

export default example;
