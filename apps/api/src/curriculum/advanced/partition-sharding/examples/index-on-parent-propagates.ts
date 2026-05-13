import { sql } from 'drizzle-orm';
import type { ExampleDef } from '../../../types.ts';

const example: ExampleDef = {
  id: 'index-on-parent-propagates',
  title: '主表建索引，自动下沉到所有子表',
  support: 'partial',
  display: {
    sql: `-- 1. 在主表上建索引
CREATE INDEX IF NOT EXISTS sales_region_idx ON sales (region);

-- 2. 查 pg_indexes，能看到主表 + 4 个子表上都有对应索引
SELECT tablename, indexname
FROM pg_indexes
WHERE schemaname = current_schema()
  AND tablename LIKE 'sales%'
ORDER BY tablename, indexname;`,
    drizzle: `import { sql } from 'drizzle-orm';

await db.execute(sql\`
  CREATE INDEX IF NOT EXISTS sales_region_idx ON sales (region)
\`);

await db.execute(sql\`
  SELECT tablename, indexname
  FROM pg_indexes
  WHERE schemaname = current_schema()
    AND tablename LIKE 'sales%'
  ORDER BY tablename, indexname
\`);`,
  },
  execute: async (db) => {
    await db.execute(sql`CREATE INDEX IF NOT EXISTS sales_region_idx ON sales (region)`);
    return db.execute(sql`
      SELECT tablename, indexname
      FROM pg_indexes
      WHERE schemaname = current_schema()
        AND tablename LIKE 'sales%'
      ORDER BY tablename, indexname
    `);
  },
};

export default example;
