import { sql } from 'drizzle-orm';
import type { ExampleDef } from '../../../types.ts';
import { customers, orders } from '../schema.ts';

const example: ExampleDef = {
  id: 'join-lateral',
  title: 'LATERAL：每个客户取最近 1 单',
  support: 'partial',
  display: {
    sql: `SELECT c.id, c.name, last.id AS last_order_id, last.ordered_at
FROM customers c
LEFT JOIN LATERAL (
  SELECT id, ordered_at
  FROM orders
  WHERE customer_id = c.id
  ORDER BY ordered_at DESC
  LIMIT 1
) last ON true
ORDER BY c.id;`,
    drizzle: `import { sql } from 'drizzle-orm';
import { customers, orders } from './schema';

await db.execute(sql\`
  SELECT c.id, c.name, last.id AS last_order_id, last.ordered_at
  FROM \${customers} c
  LEFT JOIN LATERAL (
    SELECT id, ordered_at
    FROM \${orders}
    WHERE customer_id = c.id
    ORDER BY ordered_at DESC
    LIMIT 1
  ) last ON true
  ORDER BY c.id
\`);`,
  },
  execute: (db) =>
    db.execute(sql`
      SELECT c.id, c.name, last.id AS last_order_id, last.ordered_at
      FROM ${customers} c
      LEFT JOIN LATERAL (
        SELECT id, ordered_at
        FROM ${orders}
        WHERE customer_id = c.id
        ORDER BY ordered_at DESC
        LIMIT 1
      ) last ON true
      ORDER BY c.id
    `),
};

export default example;
