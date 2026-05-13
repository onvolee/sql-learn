import { sql } from 'drizzle-orm';
import type { ExampleDef } from '../../../types.ts';

const example: ExampleDef = {
  id: 'show-autovacuum-settings',
  title: '当前 autovacuum 全局阈值',
  support: 'partial',
  display: {
    sql: `SELECT name, setting, unit, short_desc
FROM pg_settings
WHERE name IN (
  'autovacuum',
  'autovacuum_vacuum_threshold',
  'autovacuum_vacuum_scale_factor',
  'autovacuum_vacuum_cost_delay',
  'autovacuum_naptime'
)
ORDER BY name;`,
    drizzle: `import { sql } from 'drizzle-orm';

await db.execute(sql\`
  SELECT name, setting, unit, short_desc
  FROM pg_settings
  WHERE name IN (
    'autovacuum',
    'autovacuum_vacuum_threshold',
    'autovacuum_vacuum_scale_factor',
    'autovacuum_vacuum_cost_delay',
    'autovacuum_naptime'
  )
  ORDER BY name
\`);`,
  },
  execute: (db) =>
    db.execute(sql`
      SELECT name, setting, unit, short_desc
      FROM pg_settings
      WHERE name IN (
        'autovacuum',
        'autovacuum_vacuum_threshold',
        'autovacuum_vacuum_scale_factor',
        'autovacuum_vacuum_cost_delay',
        'autovacuum_naptime'
      )
      ORDER BY name
    `),
};

export default example;
