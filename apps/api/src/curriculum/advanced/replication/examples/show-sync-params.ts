import { sql } from 'drizzle-orm';
import type { ExampleDef } from '../../../types.ts';

const example: ExampleDef = {
  id: 'show-sync-params',
  title: '同步提交相关参数',
  support: 'partial',
  display: {
    sql: `SELECT name, setting
FROM pg_settings
WHERE name IN ('synchronous_commit', 'synchronous_standby_names')
ORDER BY name;`,
    drizzle: `import { sql } from 'drizzle-orm';

await db.execute(sql\`
  SELECT name, setting
  FROM pg_settings
  WHERE name IN ('synchronous_commit', 'synchronous_standby_names')
  ORDER BY name
\`);`,
  },
  execute: (db) =>
    db.execute(sql`
      SELECT name, setting
      FROM pg_settings
      WHERE name IN ('synchronous_commit', 'synchronous_standby_names')
      ORDER BY name
    `),
};

export default example;
