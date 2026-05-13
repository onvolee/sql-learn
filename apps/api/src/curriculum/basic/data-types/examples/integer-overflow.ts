import { sql } from 'drizzle-orm';
import type { ExampleDef } from '../../../types.ts';

const example: ExampleDef = {
  id: 'integer-overflow',
  title: 'integer 越界 → SQLSTATE 22003',
  support: 'partial',
  display: {
    sql: `SELECT 2147483647::integer + 1::integer AS will_overflow;
-- 期望失败：SQLSTATE 22003（numeric_value_out_of_range）`,
    drizzle: `import { sql } from 'drizzle-orm';

// 期望失败：SQLSTATE 22003（numeric_value_out_of_range）
await db.execute(sql\`
  SELECT 2147483647::integer + 1::integer AS will_overflow
\`);`,
  },
  execute: (db) =>
    db.execute(sql`
      SELECT 2147483647::integer + 1::integer AS will_overflow
    `),
};

export default example;
