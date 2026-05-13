import { sql } from 'drizzle-orm';
import type { ExampleDef } from '../../../types.ts';

const example: ExampleDef = {
  id: 'gin-default-opclass',
  title: 'GIN 默认 opclass 加速 @>',
  support: 'partial',
  display: {
    sql: `CREATE INDEX IF NOT EXISTS docs_body_gin
  ON docs USING gin (body);

-- 小表 planner 可能仍选 Seq Scan，关掉 seq scan 让 plan 显式走索引
SET LOCAL enable_seqscan = off;

EXPLAIN
SELECT id, title
FROM docs
WHERE body @> '{"tags":["sql"]}';`,
    drizzle: `import { sql } from 'drizzle-orm';

await db.execute(sql\`
  CREATE INDEX IF NOT EXISTS docs_body_gin
    ON docs USING gin (body)
\`);

await db.execute(sql\`SET LOCAL enable_seqscan = off\`);

await db.execute(sql\`
  EXPLAIN
  SELECT id, title
  FROM docs
  WHERE body @> '{"tags":["sql"]}'
\`);`,
  },
  execute: async (db) => {
    await db.execute(sql`CREATE INDEX IF NOT EXISTS docs_body_gin ON docs USING gin (body)`);
    await db.execute(sql`SET LOCAL enable_seqscan = off`);
    return db.execute(sql`
      EXPLAIN
      SELECT id, title
      FROM docs
      WHERE body @> '{"tags":["sql"]}'
    `);
  },
};

export default example;
