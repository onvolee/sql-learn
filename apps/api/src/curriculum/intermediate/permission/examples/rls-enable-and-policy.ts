import { sql } from 'drizzle-orm';
import type { ExampleDef } from '../../../types.ts';

const example: ExampleDef = {
  id: 'rls-enable-and-policy',
  title: 'RLS — 只让 tmp_reader 看到非敏感行',
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

-- 打开 RLS + 定义只允许非敏感行的策略
ALTER TABLE reports ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS tmp_only_non_sensitive ON reports;
CREATE POLICY tmp_only_non_sensitive ON reports
  FOR SELECT TO tmp_reader
  USING (NOT sensitive);

-- 切到 tmp_reader 视角再查（应少于全量 6 行）
SET ROLE tmp_reader;
SELECT count(*) AS visible_to_tmp_reader FROM reports;
RESET ROLE;

-- 清理：先撤掉 policy 和 role 的引用，再 DROP
DROP POLICY IF EXISTS tmp_only_non_sensitive ON reports;
ALTER TABLE reports DISABLE ROW LEVEL SECURITY;
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

await db.execute(sql\`ALTER TABLE reports ENABLE ROW LEVEL SECURITY\`);
await db.execute(sql\`DROP POLICY IF EXISTS tmp_only_non_sensitive ON reports\`);
await db.execute(sql\`
  CREATE POLICY tmp_only_non_sensitive ON reports
    FOR SELECT TO tmp_reader
    USING (NOT sensitive)
\`);

await db.execute(sql\`SET ROLE tmp_reader\`);
const result = await db.execute(sql\`
  SELECT count(*) AS visible_to_tmp_reader FROM reports
\`);
await db.execute(sql\`RESET ROLE\`);

await db.execute(sql\`DROP POLICY IF EXISTS tmp_only_non_sensitive ON reports\`);
await db.execute(sql\`ALTER TABLE reports DISABLE ROW LEVEL SECURITY\`);
await db.execute(sql\`REVOKE SELECT ON reports             FROM tmp_reader\`);
await db.execute(sql\`REVOKE USAGE  ON SCHEMA m_permission FROM tmp_reader\`);
await db.execute(sql\`DROP ROLE IF EXISTS tmp_reader\`);
return result;`,
  },
  execute: async (db) => {
    // 防御性清理：先扯掉 policy 再处理 role
    await db.execute(sql`DROP POLICY IF EXISTS tmp_only_non_sensitive ON reports`);
    await db.execute(sql`ALTER TABLE reports DISABLE ROW LEVEL SECURITY`);
    await db.execute(sql`
      DO $$
      BEGIN
        IF EXISTS (SELECT 1 FROM pg_roles WHERE rolname = 'tmp_reader') THEN
          REVOKE SELECT ON reports             FROM tmp_reader;
          REVOKE USAGE  ON SCHEMA m_permission FROM tmp_reader;
        END IF;
      END $$
    `);
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

    await db.execute(sql`ALTER TABLE reports ENABLE ROW LEVEL SECURITY`);
    await db.execute(sql`DROP POLICY IF EXISTS tmp_only_non_sensitive ON reports`);
    await db.execute(sql`
      CREATE POLICY tmp_only_non_sensitive ON reports
        FOR SELECT TO tmp_reader
        USING (NOT sensitive)
    `);

    await db.execute(sql`SET ROLE tmp_reader`);
    const result = await db.execute(sql`
      SELECT count(*) AS visible_to_tmp_reader FROM reports
    `);
    await db.execute(sql`RESET ROLE`);

    await db.execute(sql`DROP POLICY IF EXISTS tmp_only_non_sensitive ON reports`);
    await db.execute(sql`ALTER TABLE reports DISABLE ROW LEVEL SECURITY`);
    await db.execute(sql`REVOKE SELECT ON reports             FROM tmp_reader`);
    await db.execute(sql`REVOKE USAGE  ON SCHEMA m_permission FROM tmp_reader`);
    await db.execute(sql`DROP ROLE IF EXISTS tmp_reader`);
    return result;
  },
};

export default example;
