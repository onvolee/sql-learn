import { sql } from 'drizzle-orm';
import type { ExampleDef } from '../../../types.ts';

const example: ExampleDef = {
  id: 'available-extensions-note',
  title: '第三方备份工具说明',
  support: 'partial',
  display: {
    sql: `SELECT 'pgBackRest / Barman 在 OS 层运行，不是 PG 扩展' AS note;`,
    drizzle: `import { sql } from 'drizzle-orm';

await db.execute(sql\`
  SELECT 'pgBackRest / Barman 在 OS 层运行，不是 PG 扩展' AS note
\`);`,
  },
  execute: (db) =>
    db.execute(sql`
      SELECT 'pgBackRest / Barman 在 OS 层运行，不是 PG 扩展' AS note
    `),
};

export default example;
