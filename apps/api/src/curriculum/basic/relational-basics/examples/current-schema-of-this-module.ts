import { sql } from 'drizzle-orm';
import type { ExampleDef } from '../../../types.ts';

const example: ExampleDef = {
  id: 'current-schema-of-this-module',
  title: '当前 search_path 顶层是谁',
  support: 'partial',
  display: {
    sql: `SELECT current_schema();
-- 期望返回 m_relational_basics`,
    drizzle: `import { sql } from 'drizzle-orm';

await db.execute(sql\`SELECT current_schema()\`);`,
  },
  execute: (db) => db.execute(sql`SELECT current_schema()`),
};

export default example;
