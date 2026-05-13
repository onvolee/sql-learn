import { sql } from 'drizzle-orm';
import type { ExampleDef } from '../../../types.ts';

const example: ExampleDef = {
  id: 'pg-subscription-list',
  title: '当前库的订阅列表',
  support: 'partial',
  display: {
    sql: `SELECT subname, subenabled, subslotname
FROM pg_subscription;`,
    drizzle: `import { sql } from 'drizzle-orm';

await db.execute(sql\`
  SELECT subname, subenabled, subslotname
  FROM pg_subscription
\`);`,
  },
  execute: (db) =>
    db.execute(sql`
      SELECT subname, subenabled, subslotname
      FROM pg_subscription
    `),
};

export default example;
