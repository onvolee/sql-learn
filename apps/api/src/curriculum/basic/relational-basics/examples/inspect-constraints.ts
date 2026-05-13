import { sql } from 'drizzle-orm';
import type { ExampleDef } from '../../../types.ts';

const example: ExampleDef = {
  id: 'inspect-constraints',
  title: '看本 schema 里的主键 / 外键',
  support: 'partial',
  display: {
    sql: `SELECT conname, contype
FROM pg_constraint
WHERE connamespace = current_schema()::regnamespace
ORDER BY contype, conname;
-- contype: 'p' = primary key, 'f' = foreign key`,
    drizzle: `import { sql } from 'drizzle-orm';

await db.execute(sql\`
  SELECT conname, contype
  FROM pg_constraint
  WHERE connamespace = current_schema()::regnamespace
  ORDER BY contype, conname
\`);`,
  },
  execute: (db) =>
    db.execute(sql`
      SELECT conname, contype
      FROM pg_constraint
      WHERE connamespace = current_schema()::regnamespace
      ORDER BY contype, conname
    `),
};

export default example;
