import { sql } from 'drizzle-orm';
import type { ExampleDef } from '../../../types.ts';

const example: ExampleDef = {
  id: 'show-slow-log-threshold',
  title: '看当前慢查询日志阈值',
  support: 'partial',
  display: {
    sql: `SELECT name, setting, unit
FROM pg_settings
WHERE name IN ('log_min_duration_statement', 'log_statement')
ORDER BY name;`,
    drizzle: `import { sql } from 'drizzle-orm';

await db.execute(sql\`
  SELECT name, setting, unit
  FROM pg_settings
  WHERE name IN ('log_min_duration_statement', 'log_statement')
  ORDER BY name
\`);`,
  },
  execute: (db) =>
    db.execute(sql`
      SELECT name, setting, unit
      FROM pg_settings
      WHERE name IN ('log_min_duration_statement', 'log_statement')
      ORDER BY name
    `),
};

export default example;
