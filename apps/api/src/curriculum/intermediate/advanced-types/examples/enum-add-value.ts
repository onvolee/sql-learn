import { sql } from 'drizzle-orm';
import type { ExampleDef } from '../../../types.ts';

// ALTER TYPE ADD VALUE 在事务里能跑，但同事务内不能立刻用新值——这里只看
// enum_range 验证新值已被加入。重入安全：IF NOT EXISTS 保证多次运行幂等。
const example: ExampleDef = {
  id: 'enum-add-value',
  title: '给 ENUM 追加值（ADD VALUE IF NOT EXISTS）',
  support: 'partial',
  display: {
    sql: `ALTER TYPE color_t ADD VALUE IF NOT EXISTS 'yellow' AFTER 'green';

-- 验证：新值已加入
SELECT enum_range(NULL::color_t) AS values;`,
    drizzle: `import { sql } from 'drizzle-orm';

await db.execute(sql\`
  ALTER TYPE color_t ADD VALUE IF NOT EXISTS 'yellow' AFTER 'green'
\`);

await db.execute(sql\`
  SELECT enum_range(NULL::color_t) AS values
\`);`,
  },
  execute: async (db) => {
    await db.execute(sql`ALTER TYPE color_t ADD VALUE IF NOT EXISTS 'yellow' AFTER 'green'`);
    return db.execute(sql`SELECT enum_range(NULL::color_t) AS values`);
  },
};

export default example;
