import { sql } from 'drizzle-orm';
import type { ExampleDef } from '../../../types.ts';

const example: ExampleDef = {
  id: 'create-temp-role',
  title: '建一个临时 role 再删掉',
  support: 'partial',
  display: {
    sql: `-- PG 无 CREATE ROLE IF NOT EXISTS，用 DO 块判断
DO $$
BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_roles WHERE rolname = 'tmp_reader') THEN
    CREATE ROLE tmp_reader NOLOGIN;
  END IF;
END $$;

-- 看一下 pg_roles 里有没有
SELECT rolname, rolcanlogin
FROM pg_roles
WHERE rolname = 'tmp_reader';

-- 演示完清理，避免 role 跨事务残留
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

const result = await db.execute(sql\`
  SELECT rolname, rolcanlogin
  FROM pg_roles
  WHERE rolname = 'tmp_reader'
\`);

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
    const result = await db.execute(sql`
      SELECT rolname, rolcanlogin
      FROM pg_roles
      WHERE rolname = 'tmp_reader'
    `);
    await db.execute(sql`DROP ROLE IF EXISTS tmp_reader`);
    return result;
  },
};

export default example;
