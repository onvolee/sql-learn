import { sql } from 'drizzle-orm';
import type { ExampleDef } from '../../../types.ts';

const example: ExampleDef = {
  id: 'set-local-effect',
  title: 'SET LOCAL work_mem 仅在本事务内生效',
  support: 'partial',
  display: {
    sql: `-- 同一事务内连跑三步，观察 work_mem 的变化
SELECT current_setting('work_mem') AS before;

SET LOCAL work_mem = '32MB';

SELECT current_setting('work_mem') AS after;
-- 事务结束（COMMIT/ROLLBACK）后 work_mem 自动还原为默认值`,
    drizzle: `import { sql } from 'drizzle-orm';

const before = await db.execute(sql\`SELECT current_setting('work_mem') AS work_mem\`);
await db.execute(sql\`SET LOCAL work_mem = '32MB'\`);
const after = await db.execute(sql\`SELECT current_setting('work_mem') AS work_mem\`);

return { before, after };`,
  },
  execute: async (db) => {
    const before = await db.execute(
      sql`SELECT current_setting('work_mem') AS work_mem`,
    );
    await db.execute(sql`SET LOCAL work_mem = '32MB'`);
    const after = await db.execute(
      sql`SELECT current_setting('work_mem') AS work_mem`,
    );
    return { before, after };
  },
};

export default example;
