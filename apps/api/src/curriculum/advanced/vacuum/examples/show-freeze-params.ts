import { sql } from 'drizzle-orm';
import type { ExampleDef } from '../../../types.ts';

const example: ExampleDef = {
  id: 'show-freeze-params',
  title: '当前 freeze / wraparound 阈值',
  support: 'partial',
  display: {
    sql: `SELECT name, setting, unit, short_desc
FROM pg_settings
WHERE name IN (
  'vacuum_freeze_min_age',
  'vacuum_freeze_table_age',
  'autovacuum_freeze_max_age'
)
ORDER BY name;`,
    drizzle: `import { sql } from 'drizzle-orm';

await db.execute(sql\`
  SELECT name, setting, unit, short_desc
  FROM pg_settings
  WHERE name IN (
    'vacuum_freeze_min_age',
    'vacuum_freeze_table_age',
    'autovacuum_freeze_max_age'
  )
  ORDER BY name
\`);`,
  },
  execute: (db) =>
    db.execute(sql`
      SELECT name, setting, unit, short_desc
      FROM pg_settings
      WHERE name IN (
        'vacuum_freeze_min_age',
        'vacuum_freeze_table_age',
        'autovacuum_freeze_max_age'
      )
      ORDER BY name
    `),
};

export default example;
