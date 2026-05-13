import { sql } from 'drizzle-orm';
import type { ExampleDef } from '../../../types.ts';

const example: ExampleDef = {
  id: 'pg-cron-availability',
  title: 'pg_cron 是否可装',
  support: 'partial',
  display: {
    sql: `SELECT name, default_version, installed_version
FROM pg_available_extensions
WHERE name = 'pg_cron';`,
    drizzle: `import { sql } from 'drizzle-orm';

await db.execute(sql\`
  SELECT name, default_version, installed_version
  FROM pg_available_extensions
  WHERE name = 'pg_cron'
\`);`,
  },
  execute: (db) =>
    db.execute(sql`
      SELECT name, default_version, installed_version
      FROM pg_available_extensions
      WHERE name = 'pg_cron'
    `),
};

export default example;
