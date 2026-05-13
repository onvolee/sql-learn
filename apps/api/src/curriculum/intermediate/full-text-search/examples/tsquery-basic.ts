import { sql } from 'drizzle-orm';
import type { ExampleDef } from '../../../types.ts';

const example: ExampleDef = {
  id: 'tsquery-basic',
  title: 'to_tsquery：查询串 → tsquery',
  support: 'partial',
  display: {
    sql: `SELECT to_tsquery('english', 'quick & fox & !lazy') AS tq;`,
    drizzle: `import { sql } from 'drizzle-orm';

await db.execute(sql\`
  SELECT to_tsquery('english', 'quick & fox & !lazy') AS tq
\`);`,
  },
  execute: (db) =>
    db.execute(sql`
      SELECT to_tsquery('english', 'quick & fox & !lazy') AS tq
    `),
};

export default example;
