import { sql } from 'drizzle-orm';
import type { ExampleDef } from '../../../types.ts';

const example: ExampleDef = {
  id: 'list-schemas',
  title: '本课程的所有 module schema',
  support: 'partial',
  display: {
    sql: `SELECT schema_name
FROM information_schema.schemata
WHERE schema_name LIKE 'm_%'
ORDER BY schema_name;`,
    drizzle: `import { sql } from 'drizzle-orm';

await db.execute(sql\`
  SELECT schema_name
  FROM information_schema.schemata
  WHERE schema_name LIKE 'm_%'
  ORDER BY schema_name
\`);`,
  },
  execute: (db) =>
    db.execute(sql`
      SELECT schema_name
      FROM information_schema.schemata
      WHERE schema_name LIKE 'm_%'
      ORDER BY schema_name
    `),
};

export default example;
