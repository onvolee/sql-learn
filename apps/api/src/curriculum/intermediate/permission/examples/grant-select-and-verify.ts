import { sql } from 'drizzle-orm';
import type { ExampleDef } from '../../../types.ts';

const example: ExampleDef = {
  id: 'grant-select-and-verify',
  title: 'GRANT/REVOKE 表级权限并验证',
  support: 'partial',
  display: {
    sql: `-- 先准备 tmp role
DO $$
BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_roles WHERE rolname = 'tmp_reader') THEN
    CREATE ROLE tmp_reader NOLOGIN;
  END IF;
END $$;

GRANT SELECT ON reports TO tmp_reader;

-- 此时 role_table_grants 里能看到 tmp_reader 的 SELECT 一行
SELECT grantee, table_name, privilege_type
FROM information_schema.role_table_grants
WHERE grantee = 'tmp_reader'
  AND table_name = 'reports';

-- 收回 + 清理（再查一次会是空集）
REVOKE SELECT ON reports FROM tmp_reader;
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

await db.execute(sql\`GRANT SELECT ON reports TO tmp_reader\`);

const result = await db.execute(sql\`
  SELECT grantee, table_name, privilege_type
  FROM information_schema.role_table_grants
  WHERE grantee = 'tmp_reader'
    AND table_name = 'reports'
\`);

await db.execute(sql\`REVOKE SELECT ON reports FROM tmp_reader\`);
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
    await db.execute(sql`GRANT SELECT ON reports TO tmp_reader`);
    const result = await db.execute(sql`
      SELECT grantee, table_name, privilege_type
      FROM information_schema.role_table_grants
      WHERE grantee = 'tmp_reader'
        AND table_name = 'reports'
    `);
    await db.execute(sql`REVOKE SELECT ON reports FROM tmp_reader`);
    await db.execute(sql`DROP ROLE IF EXISTS tmp_reader`);
    return result;
  },
};

export default example;
