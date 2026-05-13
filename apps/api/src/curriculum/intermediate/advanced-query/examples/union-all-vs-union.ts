import { sql } from 'drizzle-orm';
import type { ExampleDef } from '../../../types.ts';
import { orders } from '../schema.ts';

const example: ExampleDef = {
  id: 'union-all-vs-union',
  title: 'UNION vs UNION ALL：去重对比',
  support: 'partial',
  display: {
    sql: `SELECT 'union'     AS op, count(*) AS n
FROM (
  SELECT customer_id FROM orders
  UNION
  SELECT customer_id FROM orders
) u
UNION ALL
SELECT 'union_all' AS op, count(*) AS n
FROM (
  SELECT customer_id FROM orders
  UNION ALL
  SELECT customer_id FROM orders
) ua;`,
    drizzle: `import { sql } from 'drizzle-orm';
import { orders } from './schema';

await db.execute(sql\`
  SELECT 'union'     AS op, count(*) AS n
  FROM (
    SELECT customer_id FROM \${orders}
    UNION
    SELECT customer_id FROM \${orders}
  ) u
  UNION ALL
  SELECT 'union_all' AS op, count(*) AS n
  FROM (
    SELECT customer_id FROM \${orders}
    UNION ALL
    SELECT customer_id FROM \${orders}
  ) ua
\`);`,
  },
  execute: (db) =>
    db.execute(sql`
      SELECT 'union'     AS op, count(*) AS n
      FROM (
        SELECT customer_id FROM ${orders}
        UNION
        SELECT customer_id FROM ${orders}
      ) u
      UNION ALL
      SELECT 'union_all' AS op, count(*) AS n
      FROM (
        SELECT customer_id FROM ${orders}
        UNION ALL
        SELECT customer_id FROM ${orders}
      ) ua
    `),
};

export default example;
