import { sql } from 'drizzle-orm';
import type { ExampleDef } from '../../../types.ts';

const example: ExampleDef = {
  id: 'dcl-grant-select',
  title: 'GRANT SELECT — 授予查表权限',
  support: 'partial',
  display: {
    sql: `-- 角色必须先存在，所以先确保它在
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_roles WHERE rolname = 'm_sql_syntax_reader'
  ) THEN
    CREATE ROLE m_sql_syntax_reader;
  END IF;
END $$;

-- 授权访问当前 schema + 表
GRANT USAGE  ON SCHEMA m_sql_syntax           TO m_sql_syntax_reader;
GRANT SELECT ON TABLE  m_sql_syntax.employees TO m_sql_syntax_reader;`,
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

await db.execute(sql\`GRANT USAGE  ON SCHEMA m_sql_syntax           TO m_sql_syntax_reader\`);
await db.execute(sql\`GRANT SELECT ON TABLE  m_sql_syntax.employees TO m_sql_syntax_reader\`);`,
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
    await db.execute(sql`GRANT USAGE  ON SCHEMA m_sql_syntax           TO m_sql_syntax_reader`);
    return db.execute(sql`GRANT SELECT ON TABLE  m_sql_syntax.employees TO m_sql_syntax_reader`);
  },
};

export default example;
