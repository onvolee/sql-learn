import { sql } from 'drizzle-orm';
import type { ExampleDef } from '../../../types.ts';

const example: ExampleDef = {
  id: 'mv-select',
  title: '查物化视图：读的是缓存结果',
  support: 'partial',
  display: {
    sql: `SELECT region, total_amount, sale_count
FROM mv_region_total
ORDER BY region;`,
    drizzle: `import { sql } from 'drizzle-orm';

await db.execute(sql\`
  SELECT region, total_amount, sale_count
  FROM mv_region_total
  ORDER BY region
\`);`,
  },
  execute: (db) =>
    db.execute(sql`
      SELECT region, total_amount, sale_count
      FROM mv_region_total
      ORDER BY region
    `),
};

export default example;
