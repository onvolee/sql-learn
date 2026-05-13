import { sql } from 'drizzle-orm';
import type { ExampleDef } from '../../../types.ts';

const example: ExampleDef = {
  id: 'mv-refresh',
  title: 'REFRESH 重跑底层 SELECT',
  support: 'partial',
  display: {
    sql: `REFRESH MATERIALIZED VIEW mv_region_total;

SELECT region, total_amount, sale_count
FROM mv_region_total
ORDER BY region;`,
    drizzle: `import { sql } from 'drizzle-orm';

await db.execute(sql\`REFRESH MATERIALIZED VIEW mv_region_total\`);

await db.execute(sql\`
  SELECT region, total_amount, sale_count
  FROM mv_region_total
  ORDER BY region
\`);`,
  },
  execute: async (db) => {
    await db.execute(sql`REFRESH MATERIALIZED VIEW mv_region_total`);
    return db.execute(sql`
      SELECT region, total_amount, sale_count
      FROM mv_region_total
      ORDER BY region
    `);
  },
};

export default example;
