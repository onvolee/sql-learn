import { sql } from 'drizzle-orm';
import type { ExampleDef } from '../../../types.ts';

const example: ExampleDef = {
  id: 'partition-prune-explain',
  title: 'EXPLAIN：分区键 WHERE 触发裁剪',
  support: 'partial',
  timeoutMs: 30000,
  display: {
    sql: `EXPLAIN
SELECT count(*)
FROM sales
WHERE sold_at >= '2025-04-01'
  AND sold_at <  '2025-07-01';
-- 期望只扫到 sales_q2 一张子表`,
    drizzle: `import { sql } from 'drizzle-orm';

await db.execute(sql\`
  EXPLAIN
  SELECT count(*)
  FROM sales
  WHERE sold_at >= '2025-04-01'
    AND sold_at <  '2025-07-01'
\`);`,
  },
  execute: (db) =>
    db.execute(sql`
      EXPLAIN
      SELECT count(*)
      FROM sales
      WHERE sold_at >= '2025-04-01'
        AND sold_at <  '2025-07-01'
    `),
};

export default example;
