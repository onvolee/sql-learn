import { sql } from 'drizzle-orm';
import type { ExampleDef } from '../../../types.ts';

// 注意：本 example 仅当 pgvector 扩展可装时才会跑通。
// 不可装时报错（如 SQLSTATE 0A000 / 42704）是预期教学行为——读错误信息也是学习内容。
// 使用临时表 + 末尾 DROP TABLE，避免污染 schema。
const example: ExampleDef = {
  id: 'pgvector-demo',
  title: 'pgvector 最近邻查询（L2 距离）',
  support: 'partial',
  display: {
    sql: `CREATE EXTENSION IF NOT EXISTS vector;

CREATE TEMP TABLE IF NOT EXISTS vec_demo (
  id        serial PRIMARY KEY,
  embedding vector(3)
);

INSERT INTO vec_demo (embedding) VALUES
  ('[1,2,3]'),
  ('[1,2,4]'),
  ('[9,9,9]'),
  ('[0,0,1]');

SELECT id, embedding,
       embedding <-> '[1,2,3]'::vector AS dist
FROM   vec_demo
ORDER  BY dist
LIMIT  3;

DROP TABLE IF EXISTS vec_demo;`,
    drizzle: `import { sql } from 'drizzle-orm';

await db.execute(sql\`CREATE EXTENSION IF NOT EXISTS vector\`);
await db.execute(sql\`
  CREATE TEMP TABLE IF NOT EXISTS vec_demo (
    id        serial PRIMARY KEY,
    embedding vector(3)
  )
\`);
await db.execute(sql\`
  INSERT INTO vec_demo (embedding) VALUES
    ('[1,2,3]'), ('[1,2,4]'), ('[9,9,9]'), ('[0,0,1]')
\`);
const rows = await db.execute(sql\`
  SELECT id, embedding,
         embedding <-> '[1,2,3]'::vector AS dist
  FROM   vec_demo
  ORDER  BY dist
  LIMIT  3
\`);
await db.execute(sql\`DROP TABLE IF EXISTS vec_demo\`);`,
  },
  execute: async (db) => {
    await db.execute(sql`CREATE EXTENSION IF NOT EXISTS vector`);
    await db.execute(sql`
      CREATE TEMP TABLE IF NOT EXISTS vec_demo (
        id        serial PRIMARY KEY,
        embedding vector(3)
      )
    `);
    await db.execute(sql`
      INSERT INTO vec_demo (embedding) VALUES
        ('[1,2,3]'), ('[1,2,4]'), ('[9,9,9]'), ('[0,0,1]')
    `);
    const rows = await db.execute(sql`
      SELECT id, embedding,
             embedding <-> '[1,2,3]'::vector AS dist
      FROM   vec_demo
      ORDER  BY dist
      LIMIT  3
    `);
    await db.execute(sql`DROP TABLE IF EXISTS vec_demo`);
    return rows;
  },
};

export default example;
