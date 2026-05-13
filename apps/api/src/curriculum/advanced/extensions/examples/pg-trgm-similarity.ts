import { sql } from 'drizzle-orm';
import type { ExampleDef } from '../../../types.ts';

// pg_trgm 不可装时本 example 会在 CREATE EXTENSION 处报错——属于预期教学行为。
const example: ExampleDef = {
  id: 'pg-trgm-similarity',
  title: 'pg_trgm 相似度与 % 操作符',
  support: 'partial',
  display: {
    sql: `CREATE EXTENSION IF NOT EXISTS pg_trgm;

SELECT 'hello' AS a,
       'helo'  AS b,
       similarity('hello', 'helo') AS sim,
       ('hello' % 'helo')          AS over_threshold;`,
    drizzle: `import { sql } from 'drizzle-orm';

await db.execute(sql\`CREATE EXTENSION IF NOT EXISTS pg_trgm\`);
await db.execute(sql\`
  SELECT 'hello' AS a,
         'helo'  AS b,
         similarity('hello', 'helo') AS sim,
         ('hello' % 'helo')          AS over_threshold
\`);`,
  },
  execute: async (db) => {
    await db.execute(sql`CREATE EXTENSION IF NOT EXISTS pg_trgm`);
    return db.execute(sql`
      SELECT 'hello' AS a,
             'helo'  AS b,
             similarity('hello', 'helo') AS sim,
             ('hello' % 'helo')          AS over_threshold
    `);
  },
};

export default example;
