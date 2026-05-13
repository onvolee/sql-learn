import { sql } from 'drizzle-orm';
import type { ExampleDef } from '../../../types.ts';
import { customers, products } from '../schema.ts';

const example: ExampleDef = {
  id: 'join-cross',
  title: 'CROSS JOIN：客户 × 产品 的笛卡尔积',
  support: 'partial',
  display: {
    sql: `SELECT c.name AS customer,
       p.name AS product,
       p.price
FROM customers c
CROSS JOIN products p
ORDER BY c.id, p.id;`,
    drizzle: `import { sql } from 'drizzle-orm';
import { customers, products } from './schema';

await db.execute(sql\`
  SELECT c.name AS customer,
         p.name AS product,
         p.price
  FROM \${customers} c
  CROSS JOIN \${products} p
  ORDER BY c.id, p.id
\`);`,
  },
  execute: (db) =>
    db.execute(sql`
      SELECT c.name AS customer,
             p.name AS product,
             p.price
      FROM ${customers} c
      CROSS JOIN ${products} p
      ORDER BY c.id, p.id
    `),
};

export default example;
