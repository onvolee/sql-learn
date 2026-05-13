import { sql } from 'drizzle-orm';
import type { ExampleDef } from '../../../types.ts';

const example: ExampleDef = {
  id: 'replication-slots',
  title: '复制槽列表',
  support: 'partial',
  display: {
    sql: `SELECT slot_name, slot_type, active, restart_lsn
FROM pg_replication_slots;`,
    drizzle: `import { sql } from 'drizzle-orm';

await db.execute(sql\`
  SELECT slot_name, slot_type, active, restart_lsn
  FROM pg_replication_slots
\`);`,
  },
  execute: (db) =>
    db.execute(sql`
      SELECT slot_name, slot_type, active, restart_lsn
      FROM pg_replication_slots
    `),
};

export default example;
