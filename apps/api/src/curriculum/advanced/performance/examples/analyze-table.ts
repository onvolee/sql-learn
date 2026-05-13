import { sql } from 'drizzle-orm';
import type { ExampleDef } from '../../../types.ts';

const example: ExampleDef = {
  id: 'analyze-table',
  title: 'ANALYZE — 手动刷新统计',
  support: 'partial',
  display: {
    sql: `ANALYZE orders;

-- 看看 pg_class 里 reltuples（行数估算）和 relpages（页数）刚被更新
SELECT relname, reltuples::bigint AS approx_rows, relpages
FROM pg_class
WHERE relname IN ('orders', 'customers');`,
    drizzle: `import { sql } from 'drizzle-orm';

await db.execute(sql\`ANALYZE orders\`);

await db.execute(sql\`
  SELECT relname, reltuples::bigint AS approx_rows, relpages
  FROM pg_class
  WHERE relname IN ('orders', 'customers')
\`);`,
  },
  execute: async (db) => {
    await db.execute(sql`ANALYZE orders`);
    return db.execute(sql`
      SELECT relname, reltuples::bigint AS approx_rows, relpages
      FROM pg_class
      WHERE relname IN ('orders', 'customers')
    `);
  },
};

export default example;
