import { sql } from 'drizzle-orm';
import type { ExampleDef } from '../../../types.ts';

const example: ExampleDef = {
  id: 'cte-recursive-series',
  title: '递归 CTE：生成 1..10 数字序列',
  support: 'partial',
  display: {
    sql: `WITH RECURSIVE s(n) AS (
  SELECT 1                       -- 锚点
  UNION ALL
  SELECT n + 1 FROM s WHERE n < 10  -- 递归项
)
SELECT n FROM s;`,
    drizzle: `import { sql } from 'drizzle-orm';

await db.execute(sql\`
  WITH RECURSIVE s(n) AS (
    SELECT 1
    UNION ALL
    SELECT n + 1 FROM s WHERE n < 10
  )
  SELECT n FROM s
\`);`,
  },
  execute: (db) =>
    db.execute(sql`
      WITH RECURSIVE s(n) AS (
        SELECT 1
        UNION ALL
        SELECT n + 1 FROM s WHERE n < 10
      )
      SELECT n FROM s
    `),
};

export default example;
