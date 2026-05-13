import { sql } from 'drizzle-orm';
import type { ExampleDef } from '../../../types.ts';

const example: ExampleDef = {
  id: 'gin-path-ops-opclass',
  title: 'jsonb_path_ops 体积对比',
  support: 'partial',
  display: {
    sql: `CREATE INDEX IF NOT EXISTS docs_body_gin
  ON docs USING gin (body);

CREATE INDEX IF NOT EXISTS docs_body_gin_path
  ON docs USING gin (body jsonb_path_ops);

SELECT
  indexname,
  pg_size_pretty(pg_relation_size(indexrelid)) AS size
FROM pg_indexes
JOIN pg_class ON pg_class.relname = pg_indexes.indexname
WHERE schemaname = current_schema()
  AND indexname IN ('docs_body_gin', 'docs_body_gin_path')
ORDER BY indexname;`,
    drizzle: `import { sql } from 'drizzle-orm';

await db.execute(sql\`
  CREATE INDEX IF NOT EXISTS docs_body_gin
    ON docs USING gin (body)
\`);

await db.execute(sql\`
  CREATE INDEX IF NOT EXISTS docs_body_gin_path
    ON docs USING gin (body jsonb_path_ops)
\`);

await db.execute(sql\`
  SELECT
    indexname,
    pg_size_pretty(pg_relation_size(indexrelid)) AS size
  FROM pg_indexes
  JOIN pg_class ON pg_class.relname = pg_indexes.indexname
  WHERE schemaname = current_schema()
    AND indexname IN ('docs_body_gin', 'docs_body_gin_path')
  ORDER BY indexname
\`);`,
  },
  execute: async (db) => {
    await db.execute(sql`CREATE INDEX IF NOT EXISTS docs_body_gin ON docs USING gin (body)`);
    await db.execute(
      sql`CREATE INDEX IF NOT EXISTS docs_body_gin_path ON docs USING gin (body jsonb_path_ops)`,
    );
    return db.execute(sql`
      SELECT
        indexname,
        pg_size_pretty(pg_relation_size(indexrelid)) AS size
      FROM pg_indexes
      JOIN pg_class ON pg_class.relname = pg_indexes.indexname
      WHERE schemaname = current_schema()
        AND indexname IN ('docs_body_gin', 'docs_body_gin_path')
      ORDER BY indexname
    `);
  },
};

export default example;
