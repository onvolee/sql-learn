import { sql } from 'drizzle-orm';
import type { ExampleDef } from '../../../types.ts';
import { customers, orders } from '../schema.ts';

const example: ExampleDef = {
  id: 'subquery-correlated',
  title: '相关子查询：下单数高于本 region 平均的客户',
  support: 'partial',
  display: {
    sql: `SELECT c.id, c.name, c.region,
       (SELECT count(*) FROM orders WHERE customer_id = c.id) AS n
FROM customers c
WHERE (SELECT count(*) FROM orders WHERE customer_id = c.id) >
      (SELECT avg(cnt)
       FROM (
         SELECT count(*) AS cnt
         FROM orders o2
         JOIN customers c2 ON c2.id = o2.customer_id
         WHERE c2.region = c.region
         GROUP BY o2.customer_id
       ) sub)
ORDER BY c.id;`,
    drizzle: `import { sql } from 'drizzle-orm';
import { customers, orders } from './schema';

await db.execute(sql\`
  SELECT c.id, c.name, c.region,
         (SELECT count(*) FROM \${orders} WHERE customer_id = c.id) AS n
  FROM \${customers} c
  WHERE (SELECT count(*) FROM \${orders} WHERE customer_id = c.id) >
        (SELECT avg(cnt)
         FROM (
           SELECT count(*) AS cnt
           FROM \${orders} o2
           JOIN \${customers} c2 ON c2.id = o2.customer_id
           WHERE c2.region = c.region
           GROUP BY o2.customer_id
         ) sub)
  ORDER BY c.id
\`);`,
  },
  execute: (db) =>
    db.execute(sql`
      SELECT c.id, c.name, c.region,
             (SELECT count(*) FROM ${orders} WHERE customer_id = c.id) AS n
      FROM ${customers} c
      WHERE (SELECT count(*) FROM ${orders} WHERE customer_id = c.id) >
            (SELECT avg(cnt)
             FROM (
               SELECT count(*) AS cnt
               FROM ${orders} o2
               JOIN ${customers} c2 ON c2.id = o2.customer_id
               WHERE c2.region = c.region
               GROUP BY o2.customer_id
             ) sub)
      ORDER BY c.id
    `),
};

export default example;
