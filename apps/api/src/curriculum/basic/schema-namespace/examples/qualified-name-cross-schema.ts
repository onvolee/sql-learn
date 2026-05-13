import { sql } from 'drizzle-orm';
import type { ExampleDef } from '../../../types.ts';

const example: ExampleDef = {
  id: 'qualified-name-cross-schema',
  title: '完整限定名跨 schema 查同名表',
  support: 'partial',
  display: {
    sql: `CREATE SCHEMA IF NOT EXISTS tmp_other;
CREATE TABLE IF NOT EXISTS tmp_other.t1 (id serial PRIMARY KEY, val text NOT NULL);
INSERT INTO tmp_other.t1 (val) VALUES ('other-x') ON CONFLICT DO NOTHING;

SELECT 'main' AS src, val FROM m_schema_namespace.t1
UNION ALL
SELECT 'other',       val FROM tmp_other.t1
ORDER BY src, val;`,
    drizzle: `import { sql } from 'drizzle-orm';

await db.execute(sql\`CREATE SCHEMA IF NOT EXISTS tmp_other\`);
await db.execute(sql\`
  CREATE TABLE IF NOT EXISTS tmp_other.t1 (
    id serial PRIMARY KEY,
    val text NOT NULL
  )
\`);
await db.execute(sql\`
  INSERT INTO tmp_other.t1 (val) VALUES ('other-x') ON CONFLICT DO NOTHING
\`);

return db.execute(sql\`
  SELECT 'main' AS src, val FROM m_schema_namespace.t1
  UNION ALL
  SELECT 'other',       val FROM tmp_other.t1
  ORDER BY src, val
\`);`,
  },
  execute: async (db) => {
    try {
      await db.execute(sql`CREATE SCHEMA IF NOT EXISTS tmp_other`);
      await db.execute(sql`
        CREATE TABLE IF NOT EXISTS tmp_other.t1 (
          id serial PRIMARY KEY,
          val text NOT NULL
        )
      `);
      await db.execute(sql`
        INSERT INTO tmp_other.t1 (val) VALUES ('other-x') ON CONFLICT DO NOTHING
      `);
      return await db.execute(sql`
        SELECT 'main' AS src, val FROM m_schema_namespace.t1
        UNION ALL
        SELECT 'other',       val FROM tmp_other.t1
        ORDER BY src, val
      `);
    } finally {
      await db.execute(sql`DROP SCHEMA IF EXISTS tmp_other CASCADE`);
    }
  },
};

export default example;
