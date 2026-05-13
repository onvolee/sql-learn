import { sql } from 'drizzle-orm';
import type { ExampleDef } from '../../../types.ts';

const example: ExampleDef = {
  id: 'show-connection-params',
  title: '查看连接相关参数',
  support: 'partial',
  display: {
    sql: `SELECT name, setting, unit, short_desc
FROM pg_settings
WHERE name IN (
  'max_connections',
  'superuser_reserved_connections',
  'idle_in_transaction_session_timeout',
  'statement_timeout'
)
ORDER BY name;`,
    drizzle: `import { sql } from 'drizzle-orm';

await db.execute(sql\`
  SELECT name, setting, unit, short_desc
  FROM pg_settings
  WHERE name IN (
    'max_connections',
    'superuser_reserved_connections',
    'idle_in_transaction_session_timeout',
    'statement_timeout'
  )
  ORDER BY name
\`);`,
  },
  execute: (db) =>
    db.execute(sql`
      SELECT name, setting, unit, short_desc
      FROM pg_settings
      WHERE name IN (
        'max_connections',
        'superuser_reserved_connections',
        'idle_in_transaction_session_timeout',
        'statement_timeout'
      )
      ORDER BY name
    `),
};

export default example;
