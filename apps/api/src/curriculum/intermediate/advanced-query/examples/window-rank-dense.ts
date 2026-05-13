import { sql } from 'drizzle-orm';
import type { ExampleDef } from '../../../types.ts';
import { orders } from '../schema.ts';

const example: ExampleDef = {
  id: 'window-rank-dense',
  title: 'RANK vs DENSE_RANK：并列时跳号 vs 不跳号',
  support: 'partial',
  display: {
    sql: `SELECT id,
       qty,
       rank()       OVER (ORDER BY qty DESC) AS r,
       dense_rank() OVER (ORDER BY qty DESC) AS dr
FROM orders
ORDER BY r, id;`,
    drizzle: `import { sql } from 'drizzle-orm';
import { orders } from './schema';

await db.execute(sql\`
  SELECT id,
         qty,
         rank()       OVER (ORDER BY qty DESC) AS r,
         dense_rank() OVER (ORDER BY qty DESC) AS dr
  FROM \${orders}
  ORDER BY r, id
\`);`,
  },
  execute: (db) =>
    db.execute(sql`
      SELECT id,
             qty,
             rank()       OVER (ORDER BY qty DESC) AS r,
             dense_rank() OVER (ORDER BY qty DESC) AS dr
      FROM ${orders}
      ORDER BY r, id
    `),
};

export default example;
