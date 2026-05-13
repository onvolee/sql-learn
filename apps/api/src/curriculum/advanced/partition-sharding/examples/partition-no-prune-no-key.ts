import { sql } from 'drizzle-orm';
import type { ExampleDef } from '../../../types.ts';

const example: ExampleDef = {
  id: 'partition-no-prune-no-key',
  title: 'EXPLAIN：不带分区键，全分区扫',
  support: 'partial',
  timeoutMs: 30000,
  display: {
    sql: `EXPLAIN
SELECT count(*)
FROM sales
WHERE amount > 100;
-- 不含 sold_at 谓词，4 个子表都要扫`,
    drizzle: `import { sql } from 'drizzle-orm';

await db.execute(sql\`
  EXPLAIN
  SELECT count(*)
  FROM sales
  WHERE amount > 100
\`);`,
  },
  execute: (db) =>
    db.execute(sql`
      EXPLAIN
      SELECT count(*)
      FROM sales
      WHERE amount > 100
    `),
};

export default example;
