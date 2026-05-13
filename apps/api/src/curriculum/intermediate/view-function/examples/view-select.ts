import { sql } from 'drizzle-orm';
import type { ExampleDef } from '../../../types.ts';

const example: ExampleDef = {
  id: 'view-select',
  title: '查视图就像查表',
  support: 'partial',
  display: {
    sql: `SELECT region, total_amount, sale_count
FROM v_region_total
ORDER BY region;`,
    drizzle: `import { sql } from 'drizzle-orm';

await db.execute(sql\`
  SELECT region, total_amount, sale_count
  FROM v_region_total
  ORDER BY region
\`);`,
  },
  execute: (db) =>
    db.execute(sql`
      SELECT region, total_amount, sale_count
      FROM v_region_total
      ORDER BY region
    `),
};

export default example;
