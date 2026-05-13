import { sql } from 'drizzle-orm';
import type { ExampleDef } from '../../../types.ts';

// color_t ENUM 已在 seed 里建好（'red','green','blue'）。
// 这里在临时表上演示：合法值写入成功、非法值期望抛错 22P02。
const example: ExampleDef = {
  id: 'enum-define-and-use',
  title: 'ENUM 校验：非法值被拒（22P02）',
  support: 'partial',
  display: {
    sql: `-- color_t 已在 seed 里建好：CREATE TYPE color_t AS ENUM ('red','green','blue')

CREATE TEMP TABLE IF NOT EXISTS paints_demo (
  id  serial PRIMARY KEY,
  hue color_t NOT NULL
);

-- 合法写入
INSERT INTO paints_demo (hue) VALUES ('red'), ('green');

-- 非法值，期望失败：SQLSTATE 22P02（invalid_text_representation）
INSERT INTO paints_demo (hue) VALUES ('purple');

-- cleanup
DROP TABLE paints_demo;`,
    drizzle: `import { sql } from 'drizzle-orm';

await db.execute(sql\`
  CREATE TEMP TABLE IF NOT EXISTS paints_demo (
    id  serial PRIMARY KEY,
    hue color_t NOT NULL
  )
\`);

await db.execute(sql\`
  INSERT INTO paints_demo (hue) VALUES ('red'), ('green')
\`);

// 期望失败：SQLSTATE 22P02（invalid_text_representation）
await db.execute(sql\`
  INSERT INTO paints_demo (hue) VALUES ('purple')
\`);`,
  },
  execute: async (db) => {
    await db.execute(sql`
      CREATE TEMP TABLE IF NOT EXISTS paints_demo (
        id  serial PRIMARY KEY,
        hue color_t NOT NULL
      )
    `);
    await db.execute(sql`
      INSERT INTO paints_demo (hue) VALUES ('red'), ('green')
    `);
    // 期望失败：SQLSTATE 22P02 —— 整事务回滚，临时表随之消失。
    return db.execute(sql`
      INSERT INTO paints_demo (hue) VALUES ('purple')
    `);
  },
};

export default example;
