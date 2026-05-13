import { sql } from 'drizzle-orm';
import type { ExampleDef } from '../../../types.ts';

const example: ExampleDef = {
  id: 'show-replication-role',
  title: '本实例是主还是备',
  support: 'partial',
  display: {
    sql: `SELECT pg_is_in_recovery() AS in_recovery;`,
    drizzle: `import { sql } from 'drizzle-orm';

await db.execute(sql\`
  SELECT pg_is_in_recovery() AS in_recovery
\`);`,
  },
  execute: (db) =>
    db.execute(sql`
      SELECT pg_is_in_recovery() AS in_recovery
    `),
};

export default example;
