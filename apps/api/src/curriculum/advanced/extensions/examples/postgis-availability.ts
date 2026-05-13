import { sql } from 'drizzle-orm';
import type { ExampleDef } from '../../../types.ts';

const example: ExampleDef = {
  id: 'postgis-availability',
  title: 'PostGIS 是否可装',
  support: 'partial',
  display: {
    sql: `SELECT name, default_version, installed_version
FROM pg_available_extensions
WHERE name = 'postgis';`,
    drizzle: `import { sql } from 'drizzle-orm';

await db.execute(sql\`
  SELECT name, default_version, installed_version
  FROM pg_available_extensions
  WHERE name = 'postgis'
\`);`,
  },
  execute: (db) =>
    db.execute(sql`
      SELECT name, default_version, installed_version
      FROM pg_available_extensions
      WHERE name = 'postgis'
    `),
};

export default example;
