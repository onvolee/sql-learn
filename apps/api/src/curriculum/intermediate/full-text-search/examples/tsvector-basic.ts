import { sql } from 'drizzle-orm';
import type { ExampleDef } from '../../../types.ts';

const example: ExampleDef = {
  id: 'tsvector-basic',
  title: 'to_tsvector：原文 → tsvector',
  support: 'partial',
  display: {
    sql: `SELECT to_tsvector('english', 'A quick brown fox jumps over the lazy dog') AS tsv;`,
    drizzle: `import { sql } from 'drizzle-orm';

await db.execute(sql\`
  SELECT to_tsvector('english', 'A quick brown fox jumps over the lazy dog') AS tsv
\`);`,
  },
  execute: (db) =>
    db.execute(sql`
      SELECT to_tsvector('english', 'A quick brown fox jumps over the lazy dog') AS tsv
    `),
};

export default example;
