import { sql } from 'drizzle-orm';
import type { ExampleDef } from '../../../types.ts';

const example: ExampleDef = {
  id: 'dcl-create-role',
  title: 'CREATE ROLE — 只读角色',
  support: 'partial',
  display: {
    sql: `-- PG 无 CREATE ROLE IF NOT EXISTS，用 DO 块判断
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_roles WHERE rolname = 'm_sql_syntax_reader'
  ) THEN
    CREATE ROLE m_sql_syntax_reader;
  END IF;
END $$;

SELECT rolname, rolcanlogin
FROM pg_roles
WHERE rolname = 'm_sql_syntax_reader';`,
    drizzle: `import { sql } from 'drizzle-orm';

await db.execute(sql\`
  DO $$
  BEGIN
    IF NOT EXISTS (
      SELECT 1 FROM pg_roles WHERE rolname = 'm_sql_syntax_reader'
    ) THEN
      CREATE ROLE m_sql_syntax_reader;
    END IF;
  END $$
\`);

await db.execute(sql\`
  SELECT rolname, rolcanlogin
  FROM pg_roles
  WHERE rolname = 'm_sql_syntax_reader'
\`);`,
  },
  execute: async (db) => {
    await db.execute(sql`
      DO $$
      BEGIN
        IF NOT EXISTS (
          SELECT 1 FROM pg_roles WHERE rolname = 'm_sql_syntax_reader'
        ) THEN
          CREATE ROLE m_sql_syntax_reader;
        END IF;
      END $$
    `);
    return db.execute(sql`
      SELECT rolname, rolcanlogin
      FROM pg_roles
      WHERE rolname = 'm_sql_syntax_reader'
    `);
  },
};

export default example;
