import { sql } from 'drizzle-orm';
import type { ExampleDef } from '../../../types.ts';

const example: ExampleDef = {
  id: 'export-snapshot',
  title: '导出当前事务快照 ID',
  support: 'partial',
  display: {
    sql: `SELECT pg_export_snapshot() AS snapshot_id;`,
    drizzle: `import { sql } from 'drizzle-orm';

await db.execute(sql\`SELECT pg_export_snapshot() AS snapshot_id\`);`,
  },
  execute: (db) =>
    db.execute(sql`SELECT pg_export_snapshot() AS snapshot_id`),
};

export default example;
