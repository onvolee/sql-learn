import { sql } from 'drizzle-orm';
import type { ExampleDef } from '../../../types.ts';

const example: ExampleDef = {
  id: 'dcl-revoke-select',
  title: 'REVOKE SELECT — 收回查表权限',
  support: 'partial',
  display: {
    sql: `REVOKE SELECT ON TABLE m_sql_syntax.employees FROM m_sql_syntax_reader;

-- 验证：权限已不在
SELECT grantee, table_name, privilege_type
FROM information_schema.role_table_grants
WHERE grantee   = 'm_sql_syntax_reader'
  AND table_name = 'employees';`,
    drizzle: `import { sql } from 'drizzle-orm';

await db.execute(sql\`
  REVOKE SELECT ON TABLE m_sql_syntax.employees FROM m_sql_syntax_reader
\`);

await db.execute(sql\`
  SELECT grantee, table_name, privilege_type
  FROM information_schema.role_table_grants
  WHERE grantee    = 'm_sql_syntax_reader'
    AND table_name = 'employees'
\`);`,
  },
  execute: async (db) => {
    await db.execute(sql`
      REVOKE SELECT ON TABLE m_sql_syntax.employees FROM m_sql_syntax_reader
    `);
    return db.execute(sql`
      SELECT grantee, table_name, privilege_type
      FROM information_schema.role_table_grants
      WHERE grantee    = 'm_sql_syntax_reader'
        AND table_name = 'employees'
    `);
  },
};

export default example;
