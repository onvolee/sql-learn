import { sql } from 'drizzle-orm';
import type { ExampleDef } from '../../../types.ts';

// 先建唯一索引；places 的 name 已经各不相同，建索引不会失败。
// 然后插一行已存在的 name 期望 23505。
const example: ExampleDef = {
  id: 'unique-index-as-constraint',
  title: '唯一索引兼任约束（重复 → 23505）',
  support: 'partial',
  timeoutMs: 30000,
  display: {
    sql: `CREATE UNIQUE INDEX IF NOT EXISTS uq_places_name
  ON places (name);

-- 期望失败：SQLSTATE 23505（unique_violation）
INSERT INTO places (name, location)
VALUES ('place_1', 'duplicate');`,
    drizzle: `import { sql } from 'drizzle-orm';

await db.execute(sql\`
  CREATE UNIQUE INDEX IF NOT EXISTS uq_places_name ON places (name)
\`);

// 期望失败：SQLSTATE 23505（unique_violation）
await db.execute(sql\`
  INSERT INTO places (name, location) VALUES ('place_1', 'duplicate')
\`);`,
  },
  execute: async (db) => {
    await db.execute(sql`CREATE UNIQUE INDEX IF NOT EXISTS uq_places_name ON places (name)`);
    return db.execute(sql`INSERT INTO places (name, location) VALUES ('place_1', 'duplicate')`);
  },
};

export default example;
