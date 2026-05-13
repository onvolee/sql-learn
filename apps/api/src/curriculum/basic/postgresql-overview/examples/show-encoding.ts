import { sql } from 'drizzle-orm';
import type { ExampleDef } from '../../../types.ts';

const example: ExampleDef = {
  id: 'show-encoding',
  title: '服务端字符编码',
  support: 'partial',
  display: {
    sql: `SHOW server_encoding;`,
    drizzle: `import { sql } from 'drizzle-orm';

await db.execute(sql\`SHOW server_encoding\`);`,
  },
  execute: (db) => db.execute(sql`SHOW server_encoding`),
};

export default example;
