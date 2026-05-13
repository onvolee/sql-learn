import { sql } from 'drizzle-orm';
import type { ExampleDef } from '../../../types.ts';

const example: ExampleDef = {
  id: 'dcl-inspect-grants',
  title: '查看 m_sql_syntax_reader 的表权限',
  support: 'partial',
  display: {
    sql: `SELECT grantee, table_schema, table_name, privilege_type
FROM information_schema.role_table_grants
WHERE grantee = 'm_sql_syntax_reader'
ORDER BY table_name, privilege_type;`,
    drizzle: `import { sql } from 'drizzle-orm';

await db.execute(sql\`
  SELECT grantee, table_schema, table_name, privilege_type
  FROM information_schema.role_table_grants
  WHERE grantee = 'm_sql_syntax_reader'
  ORDER BY table_name, privilege_type
\`);`,
  },
  execute: (db) =>
    db.execute(sql`
      SELECT grantee, table_schema, table_name, privilege_type
      FROM information_schema.role_table_grants
      WHERE grantee = 'm_sql_syntax_reader'
      ORDER BY table_name, privilege_type
    `),
};

export default example;
