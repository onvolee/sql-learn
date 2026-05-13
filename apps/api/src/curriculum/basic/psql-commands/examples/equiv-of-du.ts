import { sql } from 'drizzle-orm';
import type { ExampleDef } from '../../../types.ts';

const example: ExampleDef = {
  id: 'equiv-of-du',
  title: '\\du 的等价 SQL — 列出所有角色',
  support: 'partial',
  display: {
    sql: `SELECT rolname,
       rolsuper,
       rolcreatedb,
       rolcanlogin
FROM pg_roles
ORDER BY rolname;`,
    drizzle: `import { sql } from 'drizzle-orm';

await db.execute(sql\`
  SELECT rolname,
         rolsuper,
         rolcreatedb,
         rolcanlogin
  FROM pg_roles
  ORDER BY rolname
\`);`,
  },
  execute: (db) =>
    db.execute(sql`
      SELECT rolname,
             rolsuper,
             rolcreatedb,
             rolcanlogin
      FROM pg_roles
      ORDER BY rolname
    `),
};

export default example;
