import { sql } from 'drizzle-orm';
import type { ExampleDef } from '../../../types.ts';

const example: ExampleDef = {
  id: 'seq-create-use',
  title: 'CREATE SEQUENCE + nextval',
  support: 'partial',
  display: {
    sql: `CREATE SEQUENCE IF NOT EXISTS s_demo START 100;

SELECT nextval('s_demo') AS next_value;`,
    drizzle: `import { sql } from 'drizzle-orm';

await db.execute(sql\`CREATE SEQUENCE IF NOT EXISTS s_demo START 100\`);

await db.execute(sql\`SELECT nextval('s_demo') AS next_value\`);`,
  },
  execute: async (db) => {
    await db.execute(sql`CREATE SEQUENCE IF NOT EXISTS s_demo START 100`);
    return db.execute(sql`SELECT nextval('s_demo') AS next_value`);
  },
};

export default example;
