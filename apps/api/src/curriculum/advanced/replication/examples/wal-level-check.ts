import { sql } from 'drizzle-orm';
import type { ExampleDef } from '../../../types.ts';

const example: ExampleDef = {
  id: 'wal-level-check',
  title: '当前 wal_level',
  support: 'partial',
  display: {
    sql: `SHOW wal_level;`,
    drizzle: `import { sql } from 'drizzle-orm';

await db.execute(sql\`SHOW wal_level\`);`,
  },
  execute: (db) => db.execute(sql`SHOW wal_level`),
};

export default example;
