import { sql } from 'drizzle-orm';
import type { ExampleDef } from '../../../types.ts';

const example: ExampleDef = {
  id: 'show-archive-params',
  title: 'WAL 归档相关参数',
  support: 'partial',
  display: {
    sql: `SELECT name, setting
FROM pg_settings
WHERE name IN (
  'archive_mode',
  'archive_command',
  'restore_command',
  'recovery_target_time'
)
ORDER BY name;`,
    drizzle: `import { sql } from 'drizzle-orm';

await db.execute(sql\`
  SELECT name, setting
  FROM pg_settings
  WHERE name IN (
    'archive_mode',
    'archive_command',
    'restore_command',
    'recovery_target_time'
  )
  ORDER BY name
\`);`,
  },
  execute: (db) =>
    db.execute(sql`
      SELECT name, setting
      FROM pg_settings
      WHERE name IN (
        'archive_mode',
        'archive_command',
        'restore_command',
        'recovery_target_time'
      )
      ORDER BY name
    `),
};

export default example;
