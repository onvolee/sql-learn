import { sql } from 'drizzle-orm';
import type { ExampleDef } from '../../../types.ts';

const example: ExampleDef = {
  id: 'table-toast-and-size',
  title: '表大小与索引大小',
  support: 'partial',
  display: {
    sql: `SELECT
  pg_size_pretty(pg_table_size('probe'))   AS table_size,
  pg_size_pretty(pg_indexes_size('probe')) AS indexes_size,
  pg_size_pretty(pg_total_relation_size('probe')) AS total_size;`,
    drizzle: `import { sql } from 'drizzle-orm';

await db.execute(sql\`
  SELECT
    pg_size_pretty(pg_table_size('probe'))   AS table_size,
    pg_size_pretty(pg_indexes_size('probe')) AS indexes_size,
    pg_size_pretty(pg_total_relation_size('probe')) AS total_size
\`);`,
  },
  execute: (db) =>
    db.execute(sql`
      SELECT
        pg_size_pretty(pg_table_size('probe'))   AS table_size,
        pg_size_pretty(pg_indexes_size('probe')) AS indexes_size,
        pg_size_pretty(pg_total_relation_size('probe')) AS total_size
    `),
};

export default example;
