import { sql } from 'drizzle-orm';
import type { ExampleDef } from '../../../types.ts';

const example: ExampleDef = {
  id: 'list-partitions-of-customers',
  title: '列出 customers_list 的所有子分区',
  support: 'partial',
  display: {
    sql: `SELECT
  inhrelid::regclass AS partition,
  pg_get_expr(c.relpartbound, c.oid) AS bound
FROM pg_inherits i
JOIN pg_class c ON c.oid = i.inhrelid
WHERE i.inhparent = 'customers_list'::regclass
ORDER BY partition;`,
    drizzle: `import { sql } from 'drizzle-orm';

await db.execute(sql\`
  SELECT
    inhrelid::regclass AS partition,
    pg_get_expr(c.relpartbound, c.oid) AS bound
  FROM pg_inherits i
  JOIN pg_class c ON c.oid = i.inhrelid
  WHERE i.inhparent = 'customers_list'::regclass
  ORDER BY partition
\`);`,
  },
  execute: (db) =>
    db.execute(sql`
      SELECT
        inhrelid::regclass AS partition,
        pg_get_expr(c.relpartbound, c.oid) AS bound
      FROM pg_inherits i
      JOIN pg_class c ON c.oid = i.inhrelid
      WHERE i.inhparent = 'customers_list'::regclass
      ORDER BY partition
    `),
};

export default example;
