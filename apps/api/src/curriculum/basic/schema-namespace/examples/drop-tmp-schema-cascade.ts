import { sql } from 'drizzle-orm';
import type { ExampleDef } from '../../../types.ts';

const example: ExampleDef = {
  id: 'drop-tmp-schema-cascade',
  title: 'DROP SCHEMA ... CASCADE 连带删表',
  support: 'partial',
  display: {
    sql: `CREATE SCHEMA IF NOT EXISTS tmp_other;
CREATE TABLE IF NOT EXISTS tmp_other.inner_tbl (id int);

DROP SCHEMA IF EXISTS tmp_other CASCADE;

SELECT
  (SELECT count(*) FROM information_schema.schemata
   WHERE schema_name = 'tmp_other') AS schema_left,
  (SELECT count(*) FROM information_schema.tables
   WHERE table_schema = 'tmp_other' AND table_name = 'inner_tbl') AS table_left;`,
    drizzle: `import { sql } from 'drizzle-orm';

await db.execute(sql\`CREATE SCHEMA IF NOT EXISTS tmp_other\`);
await db.execute(sql\`CREATE TABLE IF NOT EXISTS tmp_other.inner_tbl (id int)\`);

await db.execute(sql\`DROP SCHEMA IF EXISTS tmp_other CASCADE\`);

await db.execute(sql\`
  SELECT
    (SELECT count(*) FROM information_schema.schemata
     WHERE schema_name = 'tmp_other') AS schema_left,
    (SELECT count(*) FROM information_schema.tables
     WHERE table_schema = 'tmp_other' AND table_name = 'inner_tbl') AS table_left
\`);`,
  },
  execute: async (db) => {
    await db.execute(sql`CREATE SCHEMA IF NOT EXISTS tmp_other`);
    await db.execute(sql`CREATE TABLE IF NOT EXISTS tmp_other.inner_tbl (id int)`);
    await db.execute(sql`DROP SCHEMA IF EXISTS tmp_other CASCADE`);
    return db.execute(sql`
      SELECT
        (SELECT count(*) FROM information_schema.schemata
         WHERE schema_name = 'tmp_other') AS schema_left,
        (SELECT count(*) FROM information_schema.tables
         WHERE table_schema = 'tmp_other' AND table_name = 'inner_tbl') AS table_left
    `);
  },
};

export default example;
