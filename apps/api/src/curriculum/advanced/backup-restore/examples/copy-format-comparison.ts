import { sql } from 'drizzle-orm';
import type { ExampleDef } from '../../../types.ts';

const example: ExampleDef = {
  id: 'copy-format-comparison',
  title: 'CSV vs 文本格式对比',
  support: 'partial',
  display: {
    sql: `-- 真实命令行使用方式：
-- \\copy (SELECT * FROM orders LIMIT 3) TO STDOUT WITH (FORMAT csv, HEADER true)
-- \\copy (SELECT * FROM orders LIMIT 3) TO STDOUT WITH (FORMAT text)
--
-- 教学环境用 SELECT 加一列拼接结果模拟两种格式输出。
SELECT
  'csv  ' AS format,
  format('%s,%s,%s', id, customer, amount) AS line
FROM orders
WHERE id <= 3
UNION ALL
SELECT
  'text ' AS format,
  format(E'%s\\t%s\\t%s', id, customer, amount) AS line
FROM orders
WHERE id <= 3
ORDER BY format, line;`,
    drizzle: `import { sql } from 'drizzle-orm';

await db.execute(sql\`
  SELECT
    'csv  ' AS format,
    format('%s,%s,%s', id, customer, amount) AS line
  FROM orders
  WHERE id <= 3
  UNION ALL
  SELECT
    'text ' AS format,
    format(E'%s\\t%s\\t%s', id, customer, amount) AS line
  FROM orders
  WHERE id <= 3
  ORDER BY format, line
\`);`,
  },
  execute: (db) =>
    db.execute(sql`
      SELECT
        'csv  ' AS format,
        format('%s,%s,%s', id, customer, amount) AS line
      FROM orders
      WHERE id <= 3
      UNION ALL
      SELECT
        'text ' AS format,
        format(E'%s\t%s\t%s', id, customer, amount) AS line
      FROM orders
      WHERE id <= 3
      ORDER BY format, line
    `),
};

export default example;
