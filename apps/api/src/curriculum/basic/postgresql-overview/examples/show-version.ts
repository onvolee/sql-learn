import { sql } from 'drizzle-orm';
import type { ExampleDef } from '../../../types.ts';

const example: ExampleDef = {
  id: 'show-version',
  title: 'PG 自报版本',
  support: 'partial',
  display: {
    sql: `SELECT version();`,
    drizzle: `import { sql } from 'drizzle-orm';

await db.execute(sql\`SELECT version()\`);`,
  },
  execute: (db) => db.execute(sql`SELECT version()`),
};

export default example;
