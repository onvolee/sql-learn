import { sql } from 'drizzle-orm';
import type { ExampleDef } from '../../../types.ts';

const example: ExampleDef = {
  id: 'set-role-test',
  title: 'SET ROLE — 切到 tmp_reader 视角',
  support: 'partial',
  display: {
    sql: `DO $$
BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_roles WHERE rolname = 'tmp_reader') THEN
    CREATE ROLE tmp_reader NOLOGIN;
  END IF;
END $$;

GRANT USAGE  ON SCHEMA m_permission TO tmp_reader;
GRANT SELECT ON reports             TO tmp_reader;

-- 切到 tmp_reader 身份再查；SET ROLE 仅在事务内生效
SET ROLE tmp_reader;
SELECT current_user AS acting_as, count(*) AS visible_rows FROM reports;
RESET ROLE;

REVOKE SELECT ON reports             FROM tmp_reader;
REVOKE USAGE  ON SCHEMA m_permission FROM tmp_reader;
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

await db.execute(sql\`GRANT USAGE  ON SCHEMA m_permission TO tmp_reader\`);
await db.execute(sql\`GRANT SELECT ON reports             TO tmp_reader\`);

await db.execute(sql\`SET ROLE tmp_reader\`);
const result = await db.execute(sql\`
  SELECT current_user AS acting_as, count(*) AS visible_rows FROM reports
\`);
await db.execute(sql\`RESET ROLE\`);

await db.execute(sql\`REVOKE SELECT ON reports             FROM tmp_reader\`);
await db.execute(sql\`REVOKE USAGE  ON SCHEMA m_permission FROM tmp_reader\`);
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
    await db.execute(sql`GRANT USAGE  ON SCHEMA m_permission TO tmp_reader`);
    await db.execute(sql`GRANT SELECT ON reports             TO tmp_reader`);
    await db.execute(sql`SET ROLE tmp_reader`);
    const result = await db.execute(sql`
      SELECT current_user AS acting_as, count(*) AS visible_rows FROM reports
    `);
    await db.execute(sql`RESET ROLE`);
    await db.execute(sql`REVOKE SELECT ON reports             FROM tmp_reader`);
    await db.execute(sql`REVOKE USAGE  ON SCHEMA m_permission FROM tmp_reader`);
    await db.execute(sql`DROP ROLE IF EXISTS tmp_reader`);
    return result;
  },
};

export default example;
