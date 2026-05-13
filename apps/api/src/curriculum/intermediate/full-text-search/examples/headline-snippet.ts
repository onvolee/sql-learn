import { sql } from 'drizzle-orm';
import type { ExampleDef } from '../../../types.ts';

const example: ExampleDef = {
  id: 'headline-snippet',
  title: 'ts_headline：高亮命中片段',
  support: 'partial',
  display: {
    sql: `SELECT id,
       title,
       ts_headline(
         'english',
         body,
         q,
         'StartSel=<b>, StopSel=</b>, MaxFragments=2, MaxWords=12, MinWords=5'
       ) AS snippet
FROM   articles, to_tsquery('english', 'index | postgres') q
WHERE  tsv @@ q
ORDER BY id;`,
    drizzle: `import { sql } from 'drizzle-orm';

await db.execute(sql\`
  SELECT id,
         title,
         ts_headline(
           'english',
           body,
           q,
           'StartSel=<b>, StopSel=</b>, MaxFragments=2, MaxWords=12, MinWords=5'
         ) AS snippet
  FROM   articles, to_tsquery('english', 'index | postgres') q
  WHERE  tsv @@ q
  ORDER BY id
\`);`,
  },
  execute: (db) =>
    db.execute(sql`
      SELECT id,
             title,
             ts_headline(
               'english',
               body,
               q,
               'StartSel=<b>, StopSel=</b>, MaxFragments=2, MaxWords=12, MinWords=5'
             ) AS snippet
      FROM   articles, to_tsquery('english', 'index | postgres') q
      WHERE  tsv @@ q
      ORDER BY id
    `),
};

export default example;
