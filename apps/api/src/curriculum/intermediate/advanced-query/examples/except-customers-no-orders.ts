import { sql } from 'drizzle-orm';
import type { ExampleDef } from '../../../types.ts';
import { customers, orders } from '../schema.ts';

const example: ExampleDef = {
  id: 'except-customers-no-orders',
  title: 'EXCEPT：从没下过单的客户',
  support: 'partial',
  display: {
    sql: `SELECT id FROM customers
EXCEPT
SELECT customer_id FROM orders
ORDER BY id;`,
    drizzle: `import { sql } from 'drizzle-orm';
import { customers, orders } from './schema';

await db.execute(sql\`
  SELECT id FROM \${customers}
  EXCEPT
  SELECT customer_id FROM \${orders}
  ORDER BY id
\`);`,
  },
  execute: (db) =>
    db.execute(sql`
      SELECT id FROM ${customers}
      EXCEPT
      SELECT customer_id FROM ${orders}
      ORDER BY id
    `),
};

export default example;
