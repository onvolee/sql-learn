import { sql } from 'drizzle-orm';
import type { ExampleDef } from '../../../types.ts';

const example: ExampleDef = {
  id: 'show-vs-current-setting',
  title: 'SHOW 与 current_setting() 等价',
  support: 'partial',
  display: {
    sql: `SELECT
  current_setting('work_mem')          AS work_mem,
  current_setting('shared_buffers')    AS shared_buffers,
  current_setting('max_connections')   AS max_connections;`,
    drizzle: `import { sql } from 'drizzle-orm';

await db.execute(sql\`
  SELECT
    current_setting('work_mem')        AS work_mem,
    current_setting('shared_buffers')  AS shared_buffers,
    current_setting('max_connections') AS max_connections
\`);`,
  },
  execute: (db) =>
    db.execute(sql`
      SELECT
        current_setting('work_mem')        AS work_mem,
        current_setting('shared_buffers')  AS shared_buffers,
        current_setting('max_connections') AS max_connections
    `),
};

export default example;
