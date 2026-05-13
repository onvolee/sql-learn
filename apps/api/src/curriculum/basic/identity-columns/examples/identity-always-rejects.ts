import { sql } from 'drizzle-orm';
import type { ExampleDef } from '../../../types.ts';

const example: ExampleDef = {
  id: 'identity-always-rejects',
  title: 'ALWAYS：不加 OVERRIDING SYSTEM VALUE 直接插会报 428C9',
  support: 'partial',
  display: {
    sql: `-- 临时建一张 ALWAYS 表
CREATE TABLE IF NOT EXISTS t_identity_always (
  id   integer GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
  name text NOT NULL
);

-- 期望失败：SQLSTATE 428C9（generated_always）
INSERT INTO t_identity_always (id, name)
VALUES (1, 'forbidden');

-- 收尾：DROP 掉临时表
DROP TABLE IF EXISTS t_identity_always;`,
    drizzle: `import { sql } from 'drizzle-orm';

await db.execute(sql\`
  CREATE TABLE IF NOT EXISTS t_identity_always (
    id   integer GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
    name text NOT NULL
  )
\`);

// 期望失败：SQLSTATE 428C9（generated_always）
await db.execute(sql\`
  INSERT INTO t_identity_always (id, name)
  VALUES (1, 'forbidden')
\`);

await db.execute(sql\`DROP TABLE IF EXISTS t_identity_always\`);`,
  },
  execute: async (db) => {
    await db.execute(sql`
      CREATE TABLE IF NOT EXISTS t_identity_always (
        id   integer GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
        name text NOT NULL
      )
    `);
    try {
      return await db.execute(sql`
        INSERT INTO t_identity_always (id, name)
        VALUES (1, 'forbidden')
      `);
    } finally {
      // best-effort 清理；如果上面 INSERT 抛了，事务已经标 abort，
      // 这条 DROP 也会被回滚，下次执行重新走 CREATE IF NOT EXISTS
      await db.execute(sql`DROP TABLE IF EXISTS t_identity_always`).catch(() => {});
    }
  },
};

export default example;
