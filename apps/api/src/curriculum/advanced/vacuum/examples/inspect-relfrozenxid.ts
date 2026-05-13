import { sql } from 'drizzle-orm';
import type { ExampleDef } from '../../../types.ts';

const example: ExampleDef = {
  id: 'inspect-relfrozenxid',
  title: 'bloat_demo 的 relfrozenxid 与年龄',
  support: 'partial',
  display: {
    sql: `-- age(relfrozenxid) 越大，离 autovacuum_freeze_max_age 越近
SELECT relname,
       relfrozenxid,
       age(relfrozenxid) AS xid_age
FROM pg_class c
JOIN pg_namespace n ON n.oid = c.relnamespace
WHERE n.nspname = 'm_vacuum'
  AND c.relname = 'bloat_demo';`,
    drizzle: `import { sql } from 'drizzle-orm';

await db.execute(sql\`
  SELECT relname,
         relfrozenxid,
         age(relfrozenxid) AS xid_age
  FROM pg_class c
  JOIN pg_namespace n ON n.oid = c.relnamespace
  WHERE n.nspname = 'm_vacuum'
    AND c.relname = 'bloat_demo'
\`);`,
  },
  execute: (db) =>
    db.execute(sql`
      SELECT relname,
             relfrozenxid,
             age(relfrozenxid) AS xid_age
      FROM pg_class c
      JOIN pg_namespace n ON n.oid = c.relnamespace
      WHERE n.nspname = 'm_vacuum'
        AND c.relname = 'bloat_demo'
    `),
};

export default example;
