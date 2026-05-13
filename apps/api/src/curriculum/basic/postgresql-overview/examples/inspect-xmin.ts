import { sql } from 'drizzle-orm';
import type { ExampleDef } from '../../../types.ts';

const example: ExampleDef = {
  id: 'inspect-xmin',
  title: '看每行的 xmin / xmax / ctid',
  support: 'partial',
  display: {
    sql: `SELECT xmin, xmax, ctid, id, name
FROM items
ORDER BY id
LIMIT 3;`,
    drizzle: `import { sql } from 'drizzle-orm';

await db.execute(sql\`
  SELECT xmin, xmax, ctid, id, name
  FROM items
  ORDER BY id
  LIMIT 3
\`);`,
  },
  execute: (db) =>
    db.execute(sql`
      SELECT xmin, xmax, ctid, id, name
      FROM items
      ORDER BY id
      LIMIT 3
    `),
};

export default example;
