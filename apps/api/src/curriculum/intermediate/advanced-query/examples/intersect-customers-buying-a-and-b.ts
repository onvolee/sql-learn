import { sql } from 'drizzle-orm';
import type { ExampleDef } from '../../../types.ts';
import { orders } from '../schema.ts';

const example: ExampleDef = {
  id: 'intersect-customers-buying-a-and-b',
  title: 'INTERSECT：同时买过 product 1 和 product 2 的客户',
  support: 'partial',
  display: {
    sql: `SELECT customer_id FROM orders WHERE product_id = 1
INTERSECT
SELECT customer_id FROM orders WHERE product_id = 2
ORDER BY customer_id;`,
    drizzle: `import { sql } from 'drizzle-orm';
import { orders } from './schema';

await db.execute(sql\`
  SELECT customer_id FROM \${orders} WHERE product_id = 1
  INTERSECT
  SELECT customer_id FROM \${orders} WHERE product_id = 2
  ORDER BY customer_id
\`);`,
  },
  execute: (db) =>
    db.execute(sql`
      SELECT customer_id FROM ${orders} WHERE product_id = 1
      INTERSECT
      SELECT customer_id FROM ${orders} WHERE product_id = 2
      ORDER BY customer_id
    `),
};

export default example;
