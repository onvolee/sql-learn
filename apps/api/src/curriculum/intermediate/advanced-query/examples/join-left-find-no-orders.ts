import { eq, isNull } from 'drizzle-orm';
import type { ExampleDef } from '../../../types.ts';
import { customers, orders } from '../schema.ts';

const example: ExampleDef = {
  id: 'join-left-find-no-orders',
  title: 'LEFT JOIN 找出从没下过单的客户',
  support: 'full',
  display: {
    sql: `SELECT c.id, c.name, c.region
FROM customers c
LEFT JOIN orders o ON o.customer_id = c.id
WHERE o.id IS NULL
ORDER BY c.id;`,
    drizzle: `import { eq, isNull } from 'drizzle-orm';
import { customers, orders } from './schema';

await db
  .select({
    id: customers.id,
    name: customers.name,
    region: customers.region,
  })
  .from(customers)
  .leftJoin(orders, eq(orders.customerId, customers.id))
  .where(isNull(orders.id))
  .orderBy(customers.id);`,
  },
  execute: (db) =>
    db
      .select({
        id: customers.id,
        name: customers.name,
        region: customers.region,
      })
      .from(customers)
      .leftJoin(orders, eq(orders.customerId, customers.id))
      .where(isNull(orders.id))
      .orderBy(customers.id),
};

export default example;
