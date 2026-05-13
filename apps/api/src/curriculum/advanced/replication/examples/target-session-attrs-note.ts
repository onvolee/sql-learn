import { sql } from 'drizzle-orm';
import type { ExampleDef } from '../../../types.ts';

const example: ExampleDef = {
  id: 'target-session-attrs-note',
  title: 'libpq 自动找主库的连接参数',
  support: 'partial',
  display: {
    sql: `SELECT 'libpq target_session_attrs=read-write 让客户端只连主库' AS note;`,
    drizzle: `import { sql } from 'drizzle-orm';

await db.execute(sql\`
  SELECT 'libpq target_session_attrs=read-write 让客户端只连主库' AS note
\`);`,
  },
  execute: (db) =>
    db.execute(sql`
      SELECT 'libpq target_session_attrs=read-write 让客户端只连主库' AS note
    `),
};

export default example;
