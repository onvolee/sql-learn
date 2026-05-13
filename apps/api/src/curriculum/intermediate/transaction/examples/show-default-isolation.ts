import { sql } from 'drizzle-orm';
import type { ExampleDef } from '../../../types.ts';

const example: ExampleDef = {
  id: 'show-default-isolation',
  title: 'SHOW 默认隔离级别',
  support: 'partial',
  display: {
    sql: `SHOW default_transaction_isolation;
-- 期望返回 'read committed'（PG 默认）`,
    drizzle: `import { sql } from 'drizzle-orm';

await db.execute(sql\`SHOW default_transaction_isolation\`);`,
  },
  execute: (db) => db.execute(sql`SHOW default_transaction_isolation`),
};

export default example;
