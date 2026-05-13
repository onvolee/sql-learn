import { sql } from 'drizzle-orm';
import type { ExampleDef } from '../../../types.ts';

const example: ExampleDef = {
  id: 'show-current-search-path',
  title: '查看当前 search_path',
  support: 'partial',
  display: {
    sql: `SHOW search_path;
-- 期望看到 m_schema_namespace, pg_catalog`,
    drizzle: `import { sql } from 'drizzle-orm';

await db.execute(sql\`SHOW search_path\`);`,
  },
  execute: (db) => db.execute(sql`SHOW search_path`),
};

export default example;
