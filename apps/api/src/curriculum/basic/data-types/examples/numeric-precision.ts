import { sql } from 'drizzle-orm';
import type { ExampleDef } from '../../../types.ts';

const example: ExampleDef = {
  id: 'numeric-precision',
  title: 'numeric(10, 4) 按 scale 四舍五入',
  support: 'partial',
  display: {
    sql: `SELECT 1.23456789::numeric(10, 4) AS rounded,
       1.99995::numeric(10, 4)    AS bumped_up;`,
    drizzle: `import { sql } from 'drizzle-orm';

await db.execute(sql\`
  SELECT 1.23456789::numeric(10, 4) AS rounded,
         1.99995::numeric(10, 4)    AS bumped_up
\`);`,
  },
  execute: (db) =>
    db.execute(sql`
      SELECT 1.23456789::numeric(10, 4) AS rounded,
             1.99995::numeric(10, 4)    AS bumped_up
    `),
};

export default example;
