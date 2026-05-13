import { sql } from 'drizzle-orm';
import type { ExampleDef } from '../../../types.ts';

const example: ExampleDef = {
  id: 'trigger-audit-on-insert',
  title: 'INSERT 一行 → audit 表自动多一行',
  support: 'partial',
  display: {
    sql: `-- 触发器 trg_sales_audit 已在 seed 里建好
INSERT INTO sales (product, region, amount)
VALUES ('demo-' || floor(random() * 1e6)::int, 'east', 99.99);

SELECT id, sale_id, product, region, amount, inserted_at
FROM sales_audit
ORDER BY id DESC
LIMIT 5;`,
    drizzle: `import { sql } from 'drizzle-orm';

await db.execute(sql\`
  INSERT INTO sales (product, region, amount)
  VALUES ('demo-' || floor(random() * 1e6)::int, 'east', 99.99)
\`);

await db.execute(sql\`
  SELECT id, sale_id, product, region, amount, inserted_at
  FROM sales_audit
  ORDER BY id DESC
  LIMIT 5
\`);`,
  },
  execute: async (db) => {
    await db.execute(sql`
      INSERT INTO sales (product, region, amount)
      VALUES ('demo-' || floor(random() * 1e6)::int, 'east', 99.99)
    `);
    return db.execute(sql`
      SELECT id, sale_id, product, region, amount, inserted_at
      FROM sales_audit
      ORDER BY id DESC
      LIMIT 5
    `);
  },
};

export default example;
