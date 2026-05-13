import { sql } from 'drizzle-orm';
import type { ExampleDef } from '../../../types.ts';

const example: ExampleDef = {
  id: 'timestamp-tz-difference',
  title: '同字面量在 timestamp vs timestamptz 的差异',
  support: 'partial',
  display: {
    sql: `-- 临时把会话时区设为东京（不持久；事务结束自动还原）
SET LOCAL timezone = 'Asia/Tokyo';

SELECT '2026-01-01 00:00:00'::timestamp        AS ts_no_tz_tokyo,
       '2026-01-01 00:00:00'::timestamptz      AS tstz_tokyo;

SET LOCAL timezone = 'UTC';

SELECT '2026-01-01 00:00:00'::timestamp        AS ts_no_tz_utc,
       '2026-01-01 00:00:00'::timestamptz      AS tstz_utc;`,
    drizzle: `import { sql } from 'drizzle-orm';

// 同一字面量先按 Asia/Tokyo 解析与显示，再切到 UTC 看差异。
// timestamp 列没有时区信息，两次解释字面量都不变；
// timestamptz 列保存的是同一时刻（UTC），但显示会跟随当前 timezone。
await db.execute(sql\`SET LOCAL timezone = 'Asia/Tokyo'\`);
await db.execute(sql\`
  SELECT '2026-01-01 00:00:00'::timestamp   AS ts_no_tz_tokyo,
         '2026-01-01 00:00:00'::timestamptz AS tstz_tokyo
\`);
await db.execute(sql\`SET LOCAL timezone = 'UTC'\`);
await db.execute(sql\`
  SELECT '2026-01-01 00:00:00'::timestamp   AS ts_no_tz_utc,
         '2026-01-01 00:00:00'::timestamptz AS tstz_utc
\`);`,
  },
  execute: async (db) => {
    await db.execute(sql`SET LOCAL timezone = 'Asia/Tokyo'`);
    const tokyo = await db.execute(sql`
      SELECT '2026-01-01 00:00:00'::timestamp   AS ts_no_tz,
             '2026-01-01 00:00:00'::timestamptz AS tstz,
             current_setting('timezone')        AS tz
    `);
    await db.execute(sql`SET LOCAL timezone = 'UTC'`);
    const utc = await db.execute(sql`
      SELECT '2026-01-01 00:00:00'::timestamp   AS ts_no_tz,
             '2026-01-01 00:00:00'::timestamptz AS tstz,
             current_setting('timezone')        AS tz
    `);
    return [...tokyo.rows, ...utc.rows];
  },
};

export default example;
