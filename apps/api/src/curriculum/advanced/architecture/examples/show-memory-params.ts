import { sql } from 'drizzle-orm';
import type { ExampleDef } from '../../../types.ts';

const example: ExampleDef = {
  id: 'show-memory-params',
  title: '关键内存 GUC 当前值',
  support: 'partial',
  display: {
    sql: `SELECT name, setting, unit
FROM pg_settings
WHERE name IN (
  'shared_buffers',
  'wal_buffers',
  'work_mem',
  'maintenance_work_mem',
  'temp_buffers',
  'effective_cache_size'
)
ORDER BY name;`,
    drizzle: `import { sql } from 'drizzle-orm';

await db.execute(sql\`
  SELECT name, setting, unit
  FROM pg_settings
  WHERE name IN (
    'shared_buffers',
    'wal_buffers',
    'work_mem',
    'maintenance_work_mem',
    'temp_buffers',
    'effective_cache_size'
  )
  ORDER BY name
\`);`,
  },
  execute: (db) =>
    db.execute(sql`
      SELECT name, setting, unit
      FROM pg_settings
      WHERE name IN (
        'shared_buffers',
        'wal_buffers',
        'work_mem',
        'maintenance_work_mem',
        'temp_buffers',
        'effective_cache_size'
      )
      ORDER BY name
    `),
};

export default example;
