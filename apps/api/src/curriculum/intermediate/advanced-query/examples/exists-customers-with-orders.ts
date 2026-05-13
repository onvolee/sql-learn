import { sql } from 'drizzle-orm';
import type { ExampleDef } from '../../../types.ts';
import { customers, orders } from '../schema.ts';

const example: ExampleDef = {
  id: 'exists-customers-with-orders',
  title: 'EXISTS：至少下过一单的客户',
  support: 'partial',
  display: {
    sql: `SELECT c.id, c.name
FROM customers c
WHERE EXISTS (
  SELECT 1
  FROM orders o
  WHERE o.customer_id = c.id
)
ORDER BY c.id;`,
    drizzle: `import { sql } from 'drizzle-orm';
import { customers, orders } from './schema';

await db.execute(sql\`
  SELECT c.id, c.name
  FROM \${customers} c
  WHERE EXISTS (
    SELECT 1
    FROM \${orders} o
    WHERE o.customer_id = c.id
  )
  ORDER BY c.id
\`);`,
  },
  execute: (db) =>
    db.execute(sql`
      SELECT c.id, c.name
      FROM ${customers} c
      WHERE EXISTS (
        SELECT 1
        FROM ${orders} o
        WHERE o.customer_id = c.id
      )
      ORDER BY c.id
    `),
};

export default example;
