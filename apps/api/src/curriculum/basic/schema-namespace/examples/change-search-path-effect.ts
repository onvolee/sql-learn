import { sql } from 'drizzle-orm';
import type { ExampleDef } from '../../../types.ts';

const example: ExampleDef = {
  id: 'change-search-path-effect',
  title: '切换 search_path 改变 t1 的归属',
  support: 'partial',
  display: {
    sql: `CREATE SCHEMA IF NOT EXISTS tmp_other;
CREATE TABLE IF NOT EXISTS tmp_other.t1 (id int);
INSERT INTO tmp_other.t1 (id) VALUES (1) ON CONFLICT DO NOTHING;

SET LOCAL search_path TO tmp_other;

-- 不带前缀的 t1 现在指向 tmp_other.t1，不是 m_schema_namespace.t1
SELECT * FROM t1;

DROP SCHEMA IF EXISTS tmp_other CASCADE;`,
    drizzle: `import { sql } from 'drizzle-orm';

await db.execute(sql\`CREATE SCHEMA IF NOT EXISTS tmp_other\`);
await db.execute(sql\`CREATE TABLE IF NOT EXISTS tmp_other.t1 (id int)\`);
await db.execute(sql\`INSERT INTO tmp_other.t1 (id) VALUES (1) ON CONFLICT DO NOTHING\`);

await db.execute(sql\`SET LOCAL search_path TO tmp_other\`);

const rows = await db.execute(sql\`SELECT * FROM t1\`);

await db.execute(sql\`DROP SCHEMA IF EXISTS tmp_other CASCADE\`);

return rows;`,
  },
  execute: async (db) => {
    try {
      await db.execute(sql`CREATE SCHEMA IF NOT EXISTS tmp_other`);
      await db.execute(sql`CREATE TABLE IF NOT EXISTS tmp_other.t1 (id int)`);
      await db.execute(sql`INSERT INTO tmp_other.t1 (id) VALUES (1) ON CONFLICT DO NOTHING`);
      await db.execute(sql`SET LOCAL search_path TO tmp_other`);
      const rows = await db.execute(sql`SELECT * FROM t1`);
      return rows;
    } finally {
      await db.execute(sql`DROP SCHEMA IF EXISTS tmp_other CASCADE`);
    }
  },
};

export default example;
