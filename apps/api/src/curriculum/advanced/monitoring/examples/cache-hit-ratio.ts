import { sql } from 'drizzle-orm';
import type { ExampleDef } from '../../../types.ts';

const example: ExampleDef = {
  id: 'cache-hit-ratio',
  title: '全库 buffer 命中率',
  support: 'partial',
  display: {
    sql: `SELECT sum(blks_hit) * 1.0
       / nullif(sum(blks_hit + blks_read), 0) AS hit_ratio
FROM pg_stat_database;`,
    drizzle: `import { sql } from 'drizzle-orm';

await db.execute(sql\`
  SELECT sum(blks_hit) * 1.0
         / nullif(sum(blks_hit + blks_read), 0) AS hit_ratio
  FROM pg_stat_database
\`);`,
  },
  execute: (db) =>
    db.execute(sql`
      SELECT sum(blks_hit) * 1.0
             / nullif(sum(blks_hit + blks_read), 0) AS hit_ratio
      FROM pg_stat_database
    `),
};

export default example;
