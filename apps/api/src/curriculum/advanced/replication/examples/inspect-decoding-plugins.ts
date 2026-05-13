import { sql } from 'drizzle-orm';
import type { ExampleDef } from '../../../types.ts';

const example: ExampleDef = {
  id: 'inspect-decoding-plugins',
  title: '可用的逻辑解码输出插件',
  support: 'partial',
  display: {
    sql: `SELECT name, default_version, installed_version
FROM pg_available_extensions
WHERE name LIKE '%wal2json%'
   OR name = 'pgoutput'
ORDER BY name;`,
    drizzle: `import { sql } from 'drizzle-orm';

await db.execute(sql\`
  SELECT name, default_version, installed_version
  FROM pg_available_extensions
  WHERE name LIKE '%wal2json%'
     OR name = 'pgoutput'
  ORDER BY name
\`);`,
  },
  execute: (db) =>
    db.execute(sql`
      SELECT name, default_version, installed_version
      FROM pg_available_extensions
      WHERE name LIKE '%wal2json%'
         OR name = 'pgoutput'
      ORDER BY name
    `),
};

export default example;
