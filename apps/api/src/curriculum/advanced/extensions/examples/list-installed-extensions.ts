import { sql } from 'drizzle-orm';
import type { ExampleDef } from '../../../types.ts';

const example: ExampleDef = {
  id: 'list-installed-extensions',
  title: '已装扩展清单（pg_extension）',
  support: 'partial',
  display: {
    sql: `SELECT extname, extversion
FROM pg_extension
ORDER BY extname;`,
    drizzle: `import { sql } from 'drizzle-orm';

await db.execute(sql\`
  SELECT extname, extversion
  FROM pg_extension
  ORDER BY extname
\`);`,
  },
  execute: (db) =>
    db.execute(sql`
      SELECT extname, extversion
      FROM pg_extension
      ORDER BY extname
    `),
};

export default example;
