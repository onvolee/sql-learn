import { sql } from 'drizzle-orm';
import type { ExampleDef } from '../../../types.ts';

const example: ExampleDef = {
  id: 'seq-currval',
  title: 'nextval 后立刻 currval',
  support: 'partial',
  display: {
    sql: `CREATE SEQUENCE IF NOT EXISTS s_demo START 100;

SELECT nextval('s_demo') AS just_advanced;

SELECT currval('s_demo') AS current_in_session;`,
    drizzle: `import { sql } from 'drizzle-orm';

await db.execute(sql\`CREATE SEQUENCE IF NOT EXISTS s_demo START 100\`);

await db.execute(sql\`SELECT nextval('s_demo') AS just_advanced\`);

await db.execute(sql\`SELECT currval('s_demo') AS current_in_session\`);`,
  },
  execute: async (db) => {
    await db.execute(sql`CREATE SEQUENCE IF NOT EXISTS s_demo START 100`);
    await db.execute(sql`SELECT nextval('s_demo') AS just_advanced`);
    return db.execute(sql`SELECT currval('s_demo') AS current_in_session`);
  },
};

export default example;
