import { sql } from 'drizzle-orm';
import type { ExampleDef } from '../../../types.ts';

const example: ExampleDef = {
  id: 'idle-in-transaction-detect',
  title: '挑出 idle in transaction 的 backend',
  support: 'partial',
  display: {
    sql: `SELECT pid,
       state,
       xact_start,
       query
FROM pg_stat_activity
WHERE state = 'idle in transaction'
ORDER BY xact_start;`,
    drizzle: `import { sql } from 'drizzle-orm';

await db.execute(sql\`
  SELECT pid,
         state,
         xact_start,
         query
  FROM pg_stat_activity
  WHERE state = 'idle in transaction'
  ORDER BY xact_start
\`);`,
  },
  execute: (db) =>
    db.execute(sql`
      SELECT pid,
             state,
             xact_start,
             query
      FROM pg_stat_activity
      WHERE state = 'idle in transaction'
      ORDER BY xact_start
    `),
};

export default example;
