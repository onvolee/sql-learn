import { sql } from 'drizzle-orm';
import type { ExampleDef } from '../../../types.ts';

const example: ExampleDef = {
  id: 'generated-column-write-fails',
  title: '写 GENERATED 列 → SQLSTATE 428C9',
  support: 'partial',
  display: {
    sql: `INSERT INTO users (name, age, age_group)
VALUES ('mallory', 30, 'adult');
-- 期望失败：SQLSTATE 428C9（generated_always）
-- "cannot insert a non-DEFAULT value into column "age_group""`,
    drizzle: `import { sql } from 'drizzle-orm';

// 期望失败：SQLSTATE 428C9（generated_always）
await db.execute(sql\`
  INSERT INTO users (name, age, age_group)
  VALUES ('mallory', 30, 'adult')
\`);`,
  },
  execute: (db) =>
    db.execute(sql`
      INSERT INTO users (name, age, age_group)
      VALUES ('mallory', 30, 'adult')
    `),
};

export default example;
