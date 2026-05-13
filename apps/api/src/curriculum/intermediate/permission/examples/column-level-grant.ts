import { sql } from 'drizzle-orm';
import type { ExampleDef } from '../../../types.ts';

const example: ExampleDef = {
  id: 'column-level-grant',
  title: '列级 GRANT — 只允许读非敏感列',
  support: 'partial',
  display: {
    sql: `DO $$
BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_roles WHERE rolname = 'tmp_reader') THEN
    CREATE ROLE tmp_reader NOLOGIN;
  END IF;
END $$;

-- 只授予 id、owner 两列的 SELECT，不含 sensitive
GRANT SELECT (id, owner) ON reports TO tmp_reader;

-- column_privileges 列出列级授权
SELECT grantee, table_name, column_name, privilege_type
FROM information_schema.column_privileges
WHERE grantee = 'tmp_reader'
  AND table_name = 'reports'
ORDER BY column_name;

REVOKE SELECT (id, owner) ON reports FROM tmp_reader;
DROP ROLE IF EXISTS tmp_reader;`,
    drizzle: `import { sql } from 'drizzle-orm';

await db.execute(sql\`
  DO $$
  BEGIN
    IF NOT EXISTS (SELECT 1 FROM pg_roles WHERE rolname = 'tmp_reader') THEN
      CREATE ROLE tmp_reader NOLOGIN;
    END IF;
  END $$
\`);

await db.execute(sql\`GRANT SELECT (id, owner) ON reports TO tmp_reader\`);

const result = await db.execute(sql\`
  SELECT grantee, table_name, column_name, privilege_type
  FROM information_schema.column_privileges
  WHERE grantee = 'tmp_reader'
    AND table_name = 'reports'
  ORDER BY column_name
\`);

await db.execute(sql\`REVOKE SELECT (id, owner) ON reports FROM tmp_reader\`);
await db.execute(sql\`DROP ROLE IF EXISTS tmp_reader\`);
return result;`,
  },
  execute: async (db) => {
    await db.execute(sql`DROP ROLE IF EXISTS tmp_reader`);
    await db.execute(sql`
      DO $$
      BEGIN
        IF NOT EXISTS (SELECT 1 FROM pg_roles WHERE rolname = 'tmp_reader') THEN
          CREATE ROLE tmp_reader NOLOGIN;
        END IF;
      END $$
    `);
    await db.execute(sql`GRANT SELECT (id, owner) ON reports TO tmp_reader`);
    const result = await db.execute(sql`
      SELECT grantee, table_name, column_name, privilege_type
      FROM information_schema.column_privileges
      WHERE grantee = 'tmp_reader'
        AND table_name = 'reports'
      ORDER BY column_name
    `);
    await db.execute(sql`REVOKE SELECT (id, owner) ON reports FROM tmp_reader`);
    await db.execute(sql`DROP ROLE IF EXISTS tmp_reader`);
    return result;
  },
};

export default example;
