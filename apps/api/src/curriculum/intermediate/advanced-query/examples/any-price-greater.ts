import { sql } from 'drizzle-orm';
import type { ExampleDef } from '../../../types.ts';
import { products } from '../schema.ts';

const example: ExampleDef = {
  id: 'any-price-greater',
  title: 'ANY：价格高于「前两件商品中任一件」',
  support: 'partial',
  display: {
    sql: `SELECT id, name, price
FROM products
WHERE price > ANY (SELECT price FROM products WHERE id < 3)
ORDER BY id;`,
    drizzle: `import { sql } from 'drizzle-orm';
import { products } from './schema';

await db.execute(sql\`
  SELECT id, name, price
  FROM \${products}
  WHERE price > ANY (SELECT price FROM \${products} WHERE id < 3)
  ORDER BY id
\`);`,
  },
  execute: (db) =>
    db.execute(sql`
      SELECT id, name, price
      FROM ${products}
      WHERE price > ANY (SELECT price FROM ${products} WHERE id < 3)
      ORDER BY id
    `),
};

export default example;
