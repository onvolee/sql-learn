import { sql } from 'drizzle-orm';
import type { ExampleDef } from '../../../types.ts';

const example: ExampleDef = {
  id: 'pg-settings-source',
  title: 'pg_settings 显示参数来源层级',
  support: 'partial',
  display: {
    sql: `SELECT name, setting, unit, source, sourcefile
FROM pg_settings
WHERE name IN ('work_mem', 'shared_buffers', 'max_connections')
ORDER BY name;`,
    drizzle: `import { sql } from 'drizzle-orm';

await db.execute(sql\`
  SELECT name, setting, unit, source, sourcefile
  FROM pg_settings
  WHERE name IN ('work_mem', 'shared_buffers', 'max_connections')
  ORDER BY name
\`);`,
  },
  execute: (db) =>
    db.execute(sql`
      SELECT name, setting, unit, source, sourcefile
      FROM pg_settings
      WHERE name IN ('work_mem', 'shared_buffers', 'max_connections')
      ORDER BY name
    `),
};

export default example;
