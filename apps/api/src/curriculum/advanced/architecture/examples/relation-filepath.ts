import { sql } from 'drizzle-orm';
import type { ExampleDef } from '../../../types.ts';

const example: ExampleDef = {
  id: 'relation-filepath',
  title: 'probe 表的物理文件路径',
  support: 'partial',
  display: {
    sql: `SELECT pg_relation_filepath('probe') AS filepath;`,
    drizzle: `import { sql } from 'drizzle-orm';

await db.execute(sql\`
  SELECT pg_relation_filepath('probe') AS filepath
\`);`,
  },
  execute: (db) =>
    db.execute(sql`SELECT pg_relation_filepath('probe') AS filepath`),
};

export default example;
