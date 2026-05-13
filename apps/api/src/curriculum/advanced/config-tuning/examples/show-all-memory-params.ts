import { sql } from 'drizzle-orm';
import type { ExampleDef } from '../../../types.ts';

const example: ExampleDef = {
  id: 'show-all-memory-params',
  title: '查看四个内存类参数',
  support: 'partial',
  display: {
    sql: `SELECT name, setting, unit, short_desc
FROM pg_settings
WHERE name IN (
  'shared_buffers',
  'work_mem',
  'maintenance_work_mem',
  'effective_cache_size'
)
ORDER BY name;`,
    drizzle: `import { sql } from 'drizzle-orm';

await db.execute(sql\`
  SELECT name, setting, unit, short_desc
  FROM pg_settings
  WHERE name IN (
    'shared_buffers',
    'work_mem',
    'maintenance_work_mem',
    'effective_cache_size'
  )
  ORDER BY name
\`);`,
  },
  execute: (db) =>
    db.execute(sql`
      SELECT name, setting, unit, short_desc
      FROM pg_settings
      WHERE name IN (
        'shared_buffers',
        'work_mem',
        'maintenance_work_mem',
        'effective_cache_size'
      )
      ORDER BY name
    `),
};

export default example;
