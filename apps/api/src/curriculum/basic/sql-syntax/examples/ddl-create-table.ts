import { sql } from 'drizzle-orm';
import type { ExampleDef } from '../../../types.ts';

const example: ExampleDef = {
  id: 'ddl-create-table',
  title: 'CREATE TABLE — 建临时副表',
  support: 'partial',
  display: {
    sql: `CREATE TABLE IF NOT EXISTS employees_archive (
  LIKE employees INCLUDING ALL
);

SELECT count(*) AS column_count
FROM information_schema.columns
WHERE table_schema = current_schema()
  AND table_name   = 'employees_archive';`,
    drizzle: `import { sql } from 'drizzle-orm';

await db.execute(sql\`
  CREATE TABLE IF NOT EXISTS employees_archive (
    LIKE employees INCLUDING ALL
  )
\`);

await db.execute(sql\`
  SELECT count(*) AS column_count
  FROM information_schema.columns
  WHERE table_schema = current_schema()
    AND table_name   = 'employees_archive'
\`);`,
  },
  execute: async (db) => {
    await db.execute(sql`
      CREATE TABLE IF NOT EXISTS employees_archive (
        LIKE employees INCLUDING ALL
      )
    `);
    return db.execute(sql`
      SELECT count(*) AS column_count
      FROM information_schema.columns
      WHERE table_schema = current_schema()
        AND table_name   = 'employees_archive'
    `);
  },
};

export default example;
