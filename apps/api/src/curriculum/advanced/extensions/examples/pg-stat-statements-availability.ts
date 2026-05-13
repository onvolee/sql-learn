import { sql } from 'drizzle-orm';
import type { ExampleDef } from '../../../types.ts';

const example: ExampleDef = {
  id: 'pg-stat-statements-availability',
  title: 'pg_stat_statements 是否可装',
  support: 'partial',
  display: {
    sql: `SELECT name, default_version, installed_version
FROM pg_available_extensions
WHERE name = 'pg_stat_statements';`,
    drizzle: `import { sql } from 'drizzle-orm';

await db.execute(sql\`
  SELECT name, default_version, installed_version
  FROM pg_available_extensions
  WHERE name = 'pg_stat_statements'
\`);`,
  },
  execute: (db) =>
    db.execute(sql`
      SELECT name, default_version, installed_version
      FROM pg_available_extensions
      WHERE name = 'pg_stat_statements'
    `),
};

export default example;
