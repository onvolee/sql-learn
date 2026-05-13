import { sql } from 'drizzle-orm';
import type { ExampleDef } from '../../../types.ts';

// 用临时表演示 EXCLUDE 约束 + GiST 防重叠：直接给 bookings 加约束会被 seed 里
// room='B' 的重叠行卡住，所以隔在 pg_temp.bookings_demo 里。
//
// 重入安全：临时表本会话存在；CREATE 用 IF NOT EXISTS，约束名固定，整段最后 DROP TABLE。
const example: ExampleDef = {
  id: 'exclude-no-overlap',
  title: 'EXCLUDE 约束 + GiST 防止区间重叠',
  support: 'partial',
  display: {
    sql: `-- 建临时表 + EXCLUDE 约束（相同 room 内 during 不允许 &&）
CREATE TEMP TABLE IF NOT EXISTS bookings_demo (
  id     serial PRIMARY KEY,
  room   text NOT NULL,
  during tstzrange NOT NULL,
  CONSTRAINT bookings_demo_no_overlap
    EXCLUDE USING gist (room WITH =, during WITH &&)
);

-- 第一条成功
INSERT INTO bookings_demo (room, during)
VALUES ('R1', tstzrange('2026-05-12 09:00+00', '2026-05-12 10:00+00', '[)'));

-- 第二条与第一条重叠，期望失败：SQLSTATE 23P01（exclusion_violation）
INSERT INTO bookings_demo (room, during)
VALUES ('R1', tstzrange('2026-05-12 09:30+00', '2026-05-12 10:30+00', '[)'));

-- cleanup
DROP TABLE bookings_demo;`,
    drizzle: `import { sql } from 'drizzle-orm';

await db.execute(sql\`
  CREATE TEMP TABLE IF NOT EXISTS bookings_demo (
    id     serial PRIMARY KEY,
    room   text NOT NULL,
    during tstzrange NOT NULL,
    CONSTRAINT bookings_demo_no_overlap
      EXCLUDE USING gist (room WITH =, during WITH &&)
  )
\`);

await db.execute(sql\`
  INSERT INTO bookings_demo (room, during)
  VALUES ('R1', tstzrange('2026-05-12 09:00+00', '2026-05-12 10:00+00', '[)'))
\`);

// 期望失败：SQLSTATE 23P01（exclusion_violation）
await db.execute(sql\`
  INSERT INTO bookings_demo (room, during)
  VALUES ('R1', tstzrange('2026-05-12 09:30+00', '2026-05-12 10:30+00', '[)'))
\`);

await db.execute(sql\`DROP TABLE bookings_demo\`);`,
  },
  execute: async (db) => {
    await db.execute(sql`
      CREATE TEMP TABLE IF NOT EXISTS bookings_demo (
        id     serial PRIMARY KEY,
        room   text NOT NULL,
        during tstzrange NOT NULL,
        CONSTRAINT bookings_demo_no_overlap
          EXCLUDE USING gist (room WITH =, during WITH &&)
      )
    `);
    await db.execute(sql`
      INSERT INTO bookings_demo (room, during)
      VALUES ('R1', tstzrange('2026-05-12 09:00+00', '2026-05-12 10:00+00', '[)'))
    `);
    // 期望失败：SQLSTATE 23P01（exclusion_violation）
    return db.execute(sql`
      INSERT INTO bookings_demo (room, during)
      VALUES ('R1', tstzrange('2026-05-12 09:30+00', '2026-05-12 10:30+00', '[)'))
    `);
    // 注：第二条 INSERT 抛错时整事务回滚，临时表随之消失，无需显式 DROP。
  },
};

export default example;
