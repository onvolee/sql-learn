import { sql } from 'drizzle-orm';
import type { ExampleDef } from '../../../types.ts';

const example: ExampleDef = {
  id: 'pg-publication-list',
  title: '当前库的发布列表',
  support: 'partial',
  display: {
    sql: `SELECT pubname, puballtables, pubinsert, pubupdate, pubdelete
FROM pg_publication;`,
    drizzle: `import { sql } from 'drizzle-orm';

await db.execute(sql\`
  SELECT pubname, puballtables, pubinsert, pubupdate, pubdelete
  FROM pg_publication
\`);`,
  },
  execute: (db) =>
    db.execute(sql`
      SELECT pubname, puballtables, pubinsert, pubupdate, pubdelete
      FROM pg_publication
    `),
};

export default example;
