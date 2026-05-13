import { sql } from 'drizzle-orm';
import type { ExampleDef } from '../../../types.ts';

const example: ExampleDef = {
  id: 'make-dead-tuples',
  title: 'UPDATE 5000 行 → 制造 dead tuple',
  support: 'partial',
  timeoutMs: 30000,
  display: {
    sql: `-- 不变的 UPDATE 也产生新行版本（payload = payload）
UPDATE bloat_demo
SET    payload = payload
WHERE  id <= 5000;

-- 让统计立即可见
SELECT pg_stat_force_next_flush();

SELECT relname, n_live_tup, n_dead_tup
FROM pg_stat_user_tables
WHERE schemaname = 'm_vacuum'
  AND relname = 'bloat_demo';`,
    drizzle: `import { sql } from 'drizzle-orm';

await db.execute(sql\`
  UPDATE bloat_demo
  SET    payload = payload
  WHERE  id <= 5000
\`);

await db.execute(sql\`SELECT pg_stat_force_next_flush()\`);

return db.execute(sql\`
  SELECT relname, n_live_tup, n_dead_tup
  FROM pg_stat_user_tables
  WHERE schemaname = 'm_vacuum'
    AND relname = 'bloat_demo'
\`);`,
  },
  execute: async (db) => {
    await db.execute(sql`
      UPDATE bloat_demo
      SET    payload = payload
      WHERE  id <= 5000
    `);
    await db.execute(sql`SELECT pg_stat_force_next_flush()`);
    return db.execute(sql`
      SELECT relname, n_live_tup, n_dead_tup
      FROM pg_stat_user_tables
      WHERE schemaname = 'm_vacuum'
        AND relname = 'bloat_demo'
    `);
  },
};

export default example;
