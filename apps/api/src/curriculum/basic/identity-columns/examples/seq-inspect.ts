import { sql } from 'drizzle-orm';
import type { ExampleDef } from '../../../types.ts';

const example: ExampleDef = {
  id: 'seq-inspect',
  title: '列出本 schema 所有 SEQUENCE',
  support: 'partial',
  display: {
    sql: `SELECT sequence_name, data_type, start_value, increment
FROM information_schema.sequences
WHERE sequence_schema = current_schema()
ORDER BY sequence_name;`,
    drizzle: `import { sql } from 'drizzle-orm';

await db.execute(sql\`
  SELECT sequence_name, data_type, start_value, increment
  FROM information_schema.sequences
  WHERE sequence_schema = current_schema()
  ORDER BY sequence_name
\`);`,
  },
  execute: (db) =>
    db.execute(sql`
      SELECT sequence_name, data_type, start_value, increment
      FROM information_schema.sequences
      WHERE sequence_schema = current_schema()
      ORDER BY sequence_name
    `),
};

export default example;
