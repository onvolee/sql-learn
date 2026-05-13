import { sql } from 'drizzle-orm';
import type { ExampleDef } from '../../../types.ts';

const example: ExampleDef = {
  id: 'view-drop-recreate',
  title: 'DROP + CREATE 临时视图',
  support: 'partial',
  display: {
    sql: `DROP VIEW IF EXISTS v_demo;

CREATE VIEW v_demo AS
SELECT product, count(*) AS cnt
FROM sales
GROUP BY product;

SELECT * FROM v_demo ORDER BY product;

DROP VIEW v_demo;`,
    drizzle: `import { sql } from 'drizzle-orm';

await db.execute(sql\`DROP VIEW IF EXISTS v_demo\`);
await db.execute(sql\`
  CREATE VIEW v_demo AS
  SELECT product, count(*) AS cnt
  FROM sales
  GROUP BY product
\`);
const rows = await db.execute(sql\`SELECT * FROM v_demo ORDER BY product\`);
await db.execute(sql\`DROP VIEW v_demo\`);
return rows;`,
  },
  execute: async (db) => {
    await db.execute(sql`DROP VIEW IF EXISTS v_demo`);
    await db.execute(sql`
      CREATE VIEW v_demo AS
      SELECT product, count(*) AS cnt
      FROM sales
      GROUP BY product
    `);
    const rows = await db.execute(sql`SELECT * FROM v_demo ORDER BY product`);
    await db.execute(sql`DROP VIEW v_demo`);
    return rows;
  },
};

export default example;
