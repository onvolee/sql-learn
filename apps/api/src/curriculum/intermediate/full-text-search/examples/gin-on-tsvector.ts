import { sql } from 'drizzle-orm';
import type { ExampleDef } from '../../../types.ts';

const example: ExampleDef = {
  id: 'gin-on-tsvector',
  title: 'GIN 索引 + EXPLAIN 看走 Bitmap Index Scan',
  support: 'partial',
  display: {
    sql: `CREATE INDEX IF NOT EXISTS articles_tsv_gin ON articles USING gin (tsv);

-- 强制走索引：关掉 seq scan，避免 8 行小表被规划器选成全表扫描
SET LOCAL enable_seqscan = off;

EXPLAIN
SELECT id, title
FROM   articles
WHERE  tsv @@ to_tsquery('english', 'postgres');`,
    drizzle: `import { sql } from 'drizzle-orm';

await db.execute(sql\`
  CREATE INDEX IF NOT EXISTS articles_tsv_gin ON articles USING gin (tsv)
\`);

await db.execute(sql\`SET LOCAL enable_seqscan = off\`);

await db.execute(sql\`
  EXPLAIN
  SELECT id, title
  FROM   articles
  WHERE  tsv @@ to_tsquery('english', 'postgres')
\`);`,
  },
  execute: async (db) => {
    await db.execute(
      sql`CREATE INDEX IF NOT EXISTS articles_tsv_gin ON articles USING gin (tsv)`,
    );
    await db.execute(sql`SET LOCAL enable_seqscan = off`);
    return db.execute(sql`
      EXPLAIN
      SELECT id, title
      FROM   articles
      WHERE  tsv @@ to_tsquery('english', 'postgres')
    `);
  },
};

export default example;
