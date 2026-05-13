import { sql } from 'drizzle-orm';
import type { ExampleDef } from '../../../types.ts';

const example: ExampleDef = {
  id: 'set-table-autovacuum-aggressive',
  title: '表级覆盖 scale_factor 为 0.05',
  support: 'partial',
  display: {
    sql: `-- 写多的大表把 scale_factor 调低让 autovacuum 跑得更勤
ALTER TABLE bloat_demo
  SET (autovacuum_vacuum_scale_factor = 0.05);

-- reloptions 现在记录了这个覆盖
SELECT relname, reloptions
FROM pg_class
WHERE relname = 'bloat_demo';

-- 演示完恢复全局默认，避免污染后续 example
ALTER TABLE bloat_demo
  RESET (autovacuum_vacuum_scale_factor);`,
    drizzle: `import { sql } from 'drizzle-orm';

await db.execute(sql\`
  ALTER TABLE bloat_demo
    SET (autovacuum_vacuum_scale_factor = 0.05)
\`);

const rows = await db.execute(sql\`
  SELECT relname, reloptions
  FROM pg_class
  WHERE relname = 'bloat_demo'
\`);

await db.execute(sql\`
  ALTER TABLE bloat_demo
    RESET (autovacuum_vacuum_scale_factor)
\`);

return rows;`,
  },
  execute: async (db) => {
    await db.execute(sql`
      ALTER TABLE bloat_demo
        SET (autovacuum_vacuum_scale_factor = 0.05)
    `);
    const rows = await db.execute(sql`
      SELECT relname, reloptions
      FROM pg_class
      WHERE relname = 'bloat_demo'
    `);
    await db.execute(sql`
      ALTER TABLE bloat_demo
        RESET (autovacuum_vacuum_scale_factor)
    `);
    return rows;
  },
};

export default example;
