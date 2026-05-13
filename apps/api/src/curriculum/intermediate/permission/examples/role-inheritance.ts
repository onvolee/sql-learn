import { sql } from 'drizzle-orm';
import type { ExampleDef } from '../../../types.ts';

const example: ExampleDef = {
  id: 'role-inheritance',
  title: '群组 role 继承 — alice 通过 reader_group 获得 SELECT',
  support: 'partial',
  display: {
    sql: `-- 群组 role（不登录，只做权限容器）
DO $$
BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_roles WHERE rolname = 'tmp_reader_group') THEN
    CREATE ROLE tmp_reader_group NOLOGIN;
  END IF;
  IF NOT EXISTS (SELECT 1 FROM pg_roles WHERE rolname = 'tmp_alice') THEN
    CREATE ROLE tmp_alice NOLOGIN INHERIT;
  END IF;
END $$;

-- 把 SELECT 授予群组，再把群组授予 alice
GRANT USAGE  ON SCHEMA m_permission TO tmp_reader_group;
GRANT SELECT ON reports             TO tmp_reader_group;
GRANT tmp_reader_group TO tmp_alice;

-- 切到 alice 身份；INHERIT 让她直接使用群组权限，无需再 SET ROLE
SET ROLE tmp_alice;
SELECT current_user AS acting_as, count(*) AS visible_rows FROM reports;
RESET ROLE;

-- 清理
REVOKE tmp_reader_group FROM tmp_alice;
REVOKE SELECT ON reports             FROM tmp_reader_group;
REVOKE USAGE  ON SCHEMA m_permission FROM tmp_reader_group;
DROP ROLE IF EXISTS tmp_alice;
DROP ROLE IF EXISTS tmp_reader_group;`,
    drizzle: `import { sql } from 'drizzle-orm';

await db.execute(sql\`
  DO $$
  BEGIN
    IF NOT EXISTS (SELECT 1 FROM pg_roles WHERE rolname = 'tmp_reader_group') THEN
      CREATE ROLE tmp_reader_group NOLOGIN;
    END IF;
    IF NOT EXISTS (SELECT 1 FROM pg_roles WHERE rolname = 'tmp_alice') THEN
      CREATE ROLE tmp_alice NOLOGIN INHERIT;
    END IF;
  END $$
\`);

await db.execute(sql\`GRANT USAGE  ON SCHEMA m_permission TO tmp_reader_group\`);
await db.execute(sql\`GRANT SELECT ON reports             TO tmp_reader_group\`);
await db.execute(sql\`GRANT tmp_reader_group TO tmp_alice\`);

await db.execute(sql\`SET ROLE tmp_alice\`);
const result = await db.execute(sql\`
  SELECT current_user AS acting_as, count(*) AS visible_rows FROM reports
\`);
await db.execute(sql\`RESET ROLE\`);

await db.execute(sql\`REVOKE tmp_reader_group FROM tmp_alice\`);
await db.execute(sql\`REVOKE SELECT ON reports             FROM tmp_reader_group\`);
await db.execute(sql\`REVOKE USAGE  ON SCHEMA m_permission FROM tmp_reader_group\`);
await db.execute(sql\`DROP ROLE IF EXISTS tmp_alice\`);
await db.execute(sql\`DROP ROLE IF EXISTS tmp_reader_group\`);
return result;`,
  },
  execute: async (db) => {
    // 防御性：先清掉可能残留的对象（按依赖顺序）
    await db.execute(sql`
      DO $$
      BEGIN
        IF EXISTS (SELECT 1 FROM pg_roles WHERE rolname = 'tmp_alice')
           AND EXISTS (SELECT 1 FROM pg_roles WHERE rolname = 'tmp_reader_group') THEN
          REVOKE tmp_reader_group FROM tmp_alice;
        END IF;
      END $$
    `);
    await db.execute(sql`DROP ROLE IF EXISTS tmp_alice`);
    await db.execute(sql`
      DO $$
      BEGIN
        IF EXISTS (SELECT 1 FROM pg_roles WHERE rolname = 'tmp_reader_group') THEN
          REVOKE SELECT ON reports             FROM tmp_reader_group;
          REVOKE USAGE  ON SCHEMA m_permission FROM tmp_reader_group;
        END IF;
      END $$
    `);
    await db.execute(sql`DROP ROLE IF EXISTS tmp_reader_group`);

    await db.execute(sql`
      DO $$
      BEGIN
        IF NOT EXISTS (SELECT 1 FROM pg_roles WHERE rolname = 'tmp_reader_group') THEN
          CREATE ROLE tmp_reader_group NOLOGIN;
        END IF;
        IF NOT EXISTS (SELECT 1 FROM pg_roles WHERE rolname = 'tmp_alice') THEN
          CREATE ROLE tmp_alice NOLOGIN INHERIT;
        END IF;
      END $$
    `);

    await db.execute(sql`GRANT USAGE  ON SCHEMA m_permission TO tmp_reader_group`);
    await db.execute(sql`GRANT SELECT ON reports             TO tmp_reader_group`);
    await db.execute(sql`GRANT tmp_reader_group TO tmp_alice`);

    await db.execute(sql`SET ROLE tmp_alice`);
    const result = await db.execute(sql`
      SELECT current_user AS acting_as, count(*) AS visible_rows FROM reports
    `);
    await db.execute(sql`RESET ROLE`);

    await db.execute(sql`REVOKE tmp_reader_group FROM tmp_alice`);
    await db.execute(sql`REVOKE SELECT ON reports             FROM tmp_reader_group`);
    await db.execute(sql`REVOKE USAGE  ON SCHEMA m_permission FROM tmp_reader_group`);
    await db.execute(sql`DROP ROLE IF EXISTS tmp_alice`);
    await db.execute(sql`DROP ROLE IF EXISTS tmp_reader_group`);
    return result;
  },
};

export default example;
