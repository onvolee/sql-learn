import { sql } from 'drizzle-orm';
import type { ExampleDef } from '../../../types.ts';

const example: ExampleDef = {
  id: 'wal-related-params',
  title: 'WAL 相关参数',
  support: 'partial',
  display: {
    sql: `SELECT name, setting, unit
FROM pg_settings
WHERE name IN (
  'wal_level',
  'max_wal_size',
  'min_wal_size',
  'checkpoint_timeout',
  'wal_buffers'
)
ORDER BY name;`,
    drizzle: `import { sql } from 'drizzle-orm';

await db.execute(sql\`
  SELECT name, setting, unit
  FROM pg_settings
  WHERE name IN (
    'wal_level',
    'max_wal_size',
    'min_wal_size',
    'checkpoint_timeout',
    'wal_buffers'
  )
  ORDER BY name
\`);`,
  },
  execute: (db) =>
    db.execute(sql`
      SELECT name, setting, unit
      FROM pg_settings
      WHERE name IN (
        'wal_level',
        'max_wal_size',
        'min_wal_size',
        'checkpoint_timeout',
        'wal_buffers'
      )
      ORDER BY name
    `),
};

export default example;
