import type { ExampleDef } from '../../../types.ts';
import { orders } from '../schema.ts';

const example: ExampleDef = {
  id: 'default-status-pending',
  title: '省略 status 列 → DEFAULT \'pending\'',
  support: 'full',
  display: {
    sql: `INSERT INTO orders (customer, total)
VALUES ('frank', 12.34)
RETURNING id, customer, status, total;`,
    drizzle: `import { orders } from './schema';

await db
  .insert(orders)
  .values({ customer: 'frank', total: '12.34' })
  .returning({
    id: orders.id,
    customer: orders.customer,
    status: orders.status,
    total: orders.total,
  });`,
  },
  execute: (db) =>
    db
      .insert(orders)
      .values({ customer: 'frank', total: '12.34' })
      .returning({
        id: orders.id,
        customer: orders.customer,
        status: orders.status,
        total: orders.total,
      }),
};

export default example;
