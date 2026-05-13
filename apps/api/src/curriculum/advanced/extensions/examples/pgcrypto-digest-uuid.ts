import { sql } from 'drizzle-orm';
import type { ExampleDef } from '../../../types.ts';

// pgcrypto 不可装时本 example 会在 CREATE EXTENSION 处报错——属于预期教学行为。
const example: ExampleDef = {
  id: 'pgcrypto-digest-uuid',
  title: 'pgcrypto 计算 SHA-256 与生成 UUID',
  support: 'partial',
  display: {
    sql: `CREATE EXTENSION IF NOT EXISTS pgcrypto;

SELECT encode(digest('hello', 'sha256'), 'hex') AS sha256_hex,
       gen_random_uuid()                        AS uuid;`,
    drizzle: `import { sql } from 'drizzle-orm';

await db.execute(sql\`CREATE EXTENSION IF NOT EXISTS pgcrypto\`);
await db.execute(sql\`
  SELECT encode(digest('hello', 'sha256'), 'hex') AS sha256_hex,
         gen_random_uuid()                        AS uuid
\`);`,
  },
  execute: async (db) => {
    await db.execute(sql`CREATE EXTENSION IF NOT EXISTS pgcrypto`);
    return db.execute(sql`
      SELECT encode(digest('hello', 'sha256'), 'hex') AS sha256_hex,
             gen_random_uuid()                        AS uuid
    `);
  },
};

export default example;
