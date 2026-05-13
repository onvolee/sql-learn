import { sql } from 'drizzle-orm';
import type { ExampleDef } from '../../../types.ts';

const example: ExampleDef = {
  id: 'inspect-system-columns',
  title: '看 probe 表的隐藏系统列',
  support: 'partial',
  display: {
    sql: `SELECT ctid, xmin, xmax, tableoid::regclass, id, val
FROM probe
ORDER BY id
LIMIT 3;`,
    drizzle: `import { sql } from 'drizzle-orm';

await db.execute(sql\`
  SELECT ctid, xmin, xmax, tableoid::regclass, id, val
  FROM probe
  ORDER BY id
  LIMIT 3
\`);`,
  },
  execute: (db) =>
    db.execute(sql`
      SELECT ctid, xmin, xmax, tableoid::regclass, id, val
      FROM probe
      ORDER BY id
      LIMIT 3
    `),
};

export default example;
