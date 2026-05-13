import { eq } from 'drizzle-orm';
import type { ExampleDef } from '../../../types.ts';
import { customers, orders } from '../schema.ts';

const example: ExampleDef = {
  id: 'join-inner',
  title: 'INNER JOIN：客户与订单匹配的行',
  support: 'full',
  display: {
    sql: `SELECT c.id   AS customer_id,
       c.name AS customer,
       o.id   AS order_id,
       o.qty
FROM customers c
INNER JOIN orders o ON o.customer_id = c.id
ORDER BY c.id, o.id;`,
    drizzle: `import { eq } from 'drizzle-orm';
import { customers, orders } from './schema';

await db
  .select({
    customer_id: customers.id,
    customer: customers.name,
    order_id: orders.id,
    qty: orders.qty,
  })
  .from(customers)
  .innerJoin(orders, eq(orders.customerId, customers.id))
  .orderBy(customers.id, orders.id);`,
  },
  execute: (db) =>
    db
      .select({
        customer_id: customers.id,
        customer: customers.name,
        order_id: orders.id,
        qty: orders.qty,
      })
      .from(customers)
      .innerJoin(orders, eq(orders.customerId, customers.id))
      .orderBy(customers.id, orders.id),
};

export default example;
