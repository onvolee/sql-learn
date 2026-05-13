import { sql } from 'drizzle-orm';
import type { ExampleDef } from '../../../types.ts';

const example: ExampleDef = {
  id: 'equiv-of-conninfo',
  title: '\\conninfo 的等价 SQL',
  support: 'partial',
  display: {
    sql: `SELECT current_database(),
       current_user,
       inet_server_addr(),
       inet_server_port();`,
    drizzle: `import { sql } from 'drizzle-orm';

await db.execute(sql\`
  SELECT current_database(),
         current_user,
         inet_server_addr(),
         inet_server_port()
\`);`,
  },
  execute: (db) =>
    db.execute(sql`
      SELECT current_database(),
             current_user,
             inet_server_addr(),
             inet_server_port()
    `),
};

export default example;
