import { sql } from 'drizzle-orm';
import type { ExampleDef } from '../../../types.ts';

const example: ExampleDef = {
  id: 'current-wal-position',
  title: '当前 WAL 位置与文件名',
  support: 'partial',
  display: {
    sql: `SELECT
  pg_current_wal_lsn()                       AS lsn,
  pg_walfile_name(pg_current_wal_lsn())      AS walfile;`,
    drizzle: `import { sql } from 'drizzle-orm';

await db.execute(sql\`
  SELECT
    pg_current_wal_lsn()                       AS lsn,
    pg_walfile_name(pg_current_wal_lsn())      AS walfile
\`);`,
  },
  execute: (db) =>
    db.execute(sql`
      SELECT
        pg_current_wal_lsn()                       AS lsn,
        pg_walfile_name(pg_current_wal_lsn())      AS walfile
    `),
};

export default example;
