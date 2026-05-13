import { sql } from 'drizzle-orm';
import type { ExampleDef } from '../../../types.ts';

const example: ExampleDef = {
  id: 'pgdata-location',
  title: '$PGDATA 数据目录位置',
  support: 'partial',
  display: {
    sql: `SHOW data_directory;`,
    drizzle: `import { sql } from 'drizzle-orm';

await db.execute(sql\`SHOW data_directory\`);`,
  },
  execute: (db) => db.execute(sql`SHOW data_directory`),
};

export default example;
