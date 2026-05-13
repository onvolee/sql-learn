import { sql } from 'drizzle-orm';
import type { ExampleDef } from '../../../types.ts';

const example: ExampleDef = {
  id: 'view-replace',
  title: 'CREATE OR REPLACE 改视图定义',
  support: 'partial',
  display: {
    sql: `-- 改定义：加 HAVING 过滤
CREATE OR REPLACE VIEW v_region_total AS
SELECT region, sum(amount) AS total_amount, count(*) AS sale_count
FROM sales
GROUP BY region
HAVING sum(amount) > 5000;

SELECT * FROM v_region_total ORDER BY region;`,
    drizzle: `import { sql } from 'drizzle-orm';

await db.execute(sql\`
  CREATE OR REPLACE VIEW v_region_total AS
  SELECT region, sum(amount) AS total_amount, count(*) AS sale_count
  FROM sales
  GROUP BY region
  HAVING sum(amount) > 5000
\`);

await db.execute(sql\`SELECT * FROM v_region_total ORDER BY region\`);`,
  },
  execute: async (db) => {
    await db.execute(sql`
      CREATE OR REPLACE VIEW v_region_total AS
      SELECT region, sum(amount) AS total_amount, count(*) AS sale_count
      FROM sales
      GROUP BY region
      HAVING sum(amount) > 5000
    `);
    return db.execute(sql`SELECT * FROM v_region_total ORDER BY region`);
  },
};

export default example;
