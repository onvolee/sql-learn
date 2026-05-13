import { sql } from 'drizzle-orm';
import type { ExampleDef } from '../../../types.ts';
import { users } from '../schema.ts';

const example: ExampleDef = {
  id: 'array-agg',
  title: 'array_agg 聚合成数组',
  support: 'partial',
  display: {
    sql: `SELECT age_group,
       array_agg(name ORDER BY name) AS names
FROM users
GROUP BY age_group
ORDER BY age_group;`,
    drizzle: `import { sql } from 'drizzle-orm';
import { users } from './schema';

await db.execute(sql\`
  SELECT age_group,
         array_agg(name ORDER BY name) AS names
  FROM \${users}
  GROUP BY age_group
  ORDER BY age_group
\`);`,
  },
  execute: (db) =>
    db.execute(sql`
      SELECT age_group,
             array_agg(name ORDER BY name) AS names
      FROM ${users}
      GROUP BY age_group
      ORDER BY age_group
    `),
};

export default example;
