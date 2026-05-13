import { sql } from 'drizzle-orm';
import type { ExampleDef } from '../../../types.ts';

const example: ExampleDef = {
  id: 'show-timezone',
  title: '当前会话时区',
  support: 'partial',
  display: {
    sql: `SHOW TimeZone;`,
    drizzle: `import { sql } from 'drizzle-orm';

await db.execute(sql\`SHOW TimeZone\`);`,
  },
  execute: (db) => db.execute(sql`SHOW TimeZone`),
};

export default example;
