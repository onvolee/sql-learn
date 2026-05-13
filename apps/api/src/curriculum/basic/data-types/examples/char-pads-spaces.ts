import { sql } from 'drizzle-orm';
import type { ExampleDef } from '../../../types.ts';

const example: ExampleDef = {
  id: 'char-pads-spaces',
  title: 'char(5) 右补空格到固定长度',
  support: 'partial',
  display: {
    sql: `SELECT 'ab'::char(5)              AS padded,
       length('ab'::char(5))       AS char_length,
       octet_length('ab'::char(5)) AS byte_length,
       'ab'::char(5) || '|'        AS visible_tail;`,
    drizzle: `import { sql } from 'drizzle-orm';

await db.execute(sql\`
  SELECT 'ab'::char(5)              AS padded,
         length('ab'::char(5))       AS char_length,
         octet_length('ab'::char(5)) AS byte_length,
         'ab'::char(5) || '|'        AS visible_tail
\`);`,
  },
  execute: (db) =>
    db.execute(sql`
      SELECT 'ab'::char(5)              AS padded,
             length('ab'::char(5))       AS char_length,
             octet_length('ab'::char(5)) AS byte_length,
             'ab'::char(5) || '|'        AS visible_tail
    `),
};

export default example;
