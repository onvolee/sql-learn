import { sql } from 'drizzle-orm';
import type { ExampleDef } from '../../../types.ts';

const example: ExampleDef = {
  id: 'pg-stat-replication',
  title: '主库视角：当前连上的备库',
  support: 'partial',
  display: {
    sql: `SELECT application_name, client_addr, state, sync_state
FROM pg_stat_replication;`,
    drizzle: `import { sql } from 'drizzle-orm';

await db.execute(sql\`
  SELECT application_name, client_addr, state, sync_state
  FROM pg_stat_replication
\`);`,
  },
  execute: (db) =>
    db.execute(sql`
      SELECT application_name, client_addr, state, sync_state
      FROM pg_stat_replication
    `),
};

export default example;
