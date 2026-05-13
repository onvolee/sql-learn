import { sql } from 'drizzle-orm';
import type { ExampleDef } from '../../../types.ts';

const example: ExampleDef = {
  id: 'create-tmp-schema',
  title: '创建一个临时 schema',
  support: 'partial',
  display: {
    sql: `CREATE SCHEMA IF NOT EXISTS tmp_other;

SELECT schema_name
FROM information_schema.schemata
WHERE schema_name = 'tmp_other';`,
    drizzle: `import { sql } from 'drizzle-orm';

await db.execute(sql\`CREATE SCHEMA IF NOT EXISTS tmp_other\`);

await db.execute(sql\`
  SELECT schema_name
  FROM information_schema.schemata
  WHERE schema_name = 'tmp_other'
\`);`,
  },
  execute: async (db) => {
    await db.execute(sql`CREATE SCHEMA IF NOT EXISTS tmp_other`);
    return db.execute(sql`
      SELECT schema_name
      FROM information_schema.schemata
      WHERE schema_name = 'tmp_other'
    `);
  },
};

export default example;
