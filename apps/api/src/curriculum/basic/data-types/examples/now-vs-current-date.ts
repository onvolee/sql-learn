import { sql } from 'drizzle-orm';
import type { ExampleDef } from '../../../types.ts';

const example: ExampleDef = {
  id: 'now-vs-current-date',
  title: 'now() / current_date / current_timestamp',
  support: 'partial',
  display: {
    sql: `SELECT now()               AS now_tstz,
       current_timestamp   AS current_ts,
       current_date        AS today,
       localtimestamp      AS local_ts;`,
    drizzle: `import { sql } from 'drizzle-orm';

await db.execute(sql\`
  SELECT now()               AS now_tstz,
         current_timestamp   AS current_ts,
         current_date        AS today,
         localtimestamp      AS local_ts
\`);`,
  },
  execute: (db) =>
    db.execute(sql`
      SELECT now()               AS now_tstz,
             current_timestamp   AS current_ts,
             current_date        AS today,
             localtimestamp      AS local_ts
    `),
};

export default example;
