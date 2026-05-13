import type { ExampleDef } from '../../../types.ts';
import { orders } from '../schema.ts';

const example: ExampleDef = {
  id: 'inspect-orders',
  title: '查看 orders 前 10 行',
  support: 'full',
  display: {
    sql: `SELECT id, customer, amount
FROM orders
ORDER BY id
LIMIT 10;`,
    drizzle: `import { orders } from './schema';

await db
  .select({ id: orders.id, customer: orders.customer, amount: orders.amount })
  .from(orders)
  .orderBy(orders.id)
  .limit(10);`,
  },
  execute: (db) =>
    db
      .select({ id: orders.id, customer: orders.customer, amount: orders.amount })
      .from(orders)
      .orderBy(orders.id)
      .limit(10),
};

export default example;
