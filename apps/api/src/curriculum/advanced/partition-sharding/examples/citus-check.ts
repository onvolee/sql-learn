import { sql } from 'drizzle-orm';
import type { ExampleDef } from '../../../types.ts';

const example: ExampleDef = {
  id: 'citus-check',
  title: '查本实例是否带 citus 扩展',
  support: 'partial',
  display: {
    sql: `SELECT name, default_version, installed_version, comment
FROM pg_available_extensions
WHERE name = 'citus';
-- 多数本地 PG 返回 0 行：citus 不在内置扩展集，需要单独装包`,
    drizzle: `import { sql } from 'drizzle-orm';

await db.execute(sql\`
  SELECT name, default_version, installed_version, comment
  FROM pg_available_extensions
  WHERE name = 'citus'
\`);`,
  },
  execute: (db) =>
    db.execute(sql`
      SELECT name, default_version, installed_version, comment
      FROM pg_available_extensions
      WHERE name = 'citus'
    `),
};

export default example;
