import { sql } from 'drizzle-orm';
import type { ExampleDef } from '../../../types.ts';

const example: ExampleDef = {
  id: 'varchar-length-limit',
  title: 'varchar(10) 超长 → SQLSTATE 22001',
  support: 'partial',
  display: {
    sql: `SELECT 'this-string-is-way-too-long'::varchar(10) AS too_long;
-- 期望失败：SQLSTATE 22001（string_data_right_truncation）`,
    drizzle: `import { sql } from 'drizzle-orm';

// 期望失败：SQLSTATE 22001（string_data_right_truncation）
await db.execute(sql\`
  SELECT 'this-string-is-way-too-long'::varchar(10) AS too_long
\`);`,
  },
  execute: (db) =>
    db.execute(sql`
      SELECT 'this-string-is-way-too-long'::varchar(10) AS too_long
    `),
};

export default example;
