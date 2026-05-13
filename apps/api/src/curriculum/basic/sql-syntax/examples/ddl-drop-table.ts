import { sql } from 'drizzle-orm';
import type { ExampleDef } from '../../../types.ts';

const example: ExampleDef = {
  id: 'ddl-drop-table',
  title: 'DROP TABLE — 删临时副表',
  support: 'partial',
  display: {
    sql: `DROP TABLE IF EXISTS employees_archive;

SELECT count(*) AS still_exists
FROM information_schema.tables
WHERE table_schema = current_schema()
  AND table_name   = 'employees_archive';`,
    drizzle: `import { sql } from 'drizzle-orm';

await db.execute(sql\`DROP TABLE IF EXISTS employees_archive\`);

await db.execute(sql\`
  SELECT count(*) AS still_exists
  FROM information_schema.tables
  WHERE table_schema = current_schema()
    AND table_name   = 'employees_archive'
\`);`,
  },
  execute: async (db) => {
    await db.execute(sql`DROP TABLE IF EXISTS employees_archive`);
    return db.execute(sql`
      SELECT count(*) AS still_exists
      FROM information_schema.tables
      WHERE table_schema = current_schema()
        AND table_name   = 'employees_archive'
    `);
  },
};

export default example;
