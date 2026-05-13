import { sql } from 'drizzle-orm';
import type { ExampleDef } from '../../../types.ts';

// email_t DOMAIN 已在 seed 里建好；这里只在临时表上用它演示约束行为。
// 非法插入会让整事务回滚，所以"合法插入"的演示只能放在错误前——示例最后一句
// 是非法 INSERT，期望抛错。重入安全：临时表事务结束自动消失。
const example: ExampleDef = {
  id: 'domain-define-and-use',
  title: 'DOMAIN 校验：非法 email 被拒（23514）',
  support: 'partial',
  display: {
    sql: `-- email_t 已在 seed 里建好：DOMAIN AS text CHECK (VALUE ~ '^[^@]+@[^@]+$')

CREATE TEMP TABLE IF NOT EXISTS contacts_demo (
  id   serial PRIMARY KEY,
  mail email_t NOT NULL
);

-- 合法写入
INSERT INTO contacts_demo (mail) VALUES ('alice@example.com');

-- 非法写入，期望失败：SQLSTATE 23514（check_violation）
INSERT INTO contacts_demo (mail) VALUES ('not-an-email');

-- cleanup（错误回滚时临时表也会消失，这里展示显式 DROP 的写法）
DROP TABLE contacts_demo;`,
    drizzle: `import { sql } from 'drizzle-orm';

await db.execute(sql\`
  CREATE TEMP TABLE IF NOT EXISTS contacts_demo (
    id   serial PRIMARY KEY,
    mail email_t NOT NULL
  )
\`);

await db.execute(sql\`
  INSERT INTO contacts_demo (mail) VALUES ('alice@example.com')
\`);

// 期望失败：SQLSTATE 23514（check_violation）
await db.execute(sql\`
  INSERT INTO contacts_demo (mail) VALUES ('not-an-email')
\`);`,
  },
  execute: async (db) => {
    await db.execute(sql`
      CREATE TEMP TABLE IF NOT EXISTS contacts_demo (
        id   serial PRIMARY KEY,
        mail email_t NOT NULL
      )
    `);
    await db.execute(sql`
      INSERT INTO contacts_demo (mail) VALUES ('alice@example.com')
    `);
    // 期望失败：SQLSTATE 23514（check_violation）—— 整事务回滚，临时表随之消失。
    return db.execute(sql`
      INSERT INTO contacts_demo (mail) VALUES ('not-an-email')
    `);
  },
};

export default example;
