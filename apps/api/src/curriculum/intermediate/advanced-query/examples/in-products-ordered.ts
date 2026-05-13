import { sql } from 'drizzle-orm';
import type { ExampleDef } from '../../../types.ts';
import { products, orders } from '../schema.ts';

const example: ExampleDef = {
  id: 'in-products-ordered',
  title: 'IN：被任何订单买过的产品',
  support: 'partial',
  display: {
    sql: `SELECT id, name, price
FROM products
WHERE id IN (SELECT product_id FROM orders)
ORDER BY id;`,
    drizzle: `import { sql } from 'drizzle-orm';
import { products, orders } from './schema';

await db.execute(sql\`
  SELECT id, name, price
  FROM \${products}
  WHERE id IN (SELECT product_id FROM \${orders})
  ORDER BY id
\`);`,
  },
  execute: (db) =>
    db.execute(sql`
      SELECT id, name, price
      FROM ${products}
      WHERE id IN (SELECT product_id FROM ${orders})
      ORDER BY id
    `),
};

export default example;
