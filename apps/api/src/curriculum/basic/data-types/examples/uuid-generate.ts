import { sql } from 'drizzle-orm';
import type { ExampleDef } from '../../../types.ts';

const example: ExampleDef = {
  id: 'uuid-generate',
  title: 'gen_random_uuid() 生成随机 UUID',
  support: 'partial',
  display: {
    sql: `SELECT gen_random_uuid() AS u1,
       gen_random_uuid() AS u2,
       gen_random_uuid() AS u3;`,
    drizzle: `import { sql } from 'drizzle-orm';

await db.execute(sql\`
  SELECT gen_random_uuid() AS u1,
         gen_random_uuid() AS u2,
         gen_random_uuid() AS u3
\`);`,
  },
  execute: (db) =>
    db.execute(sql`
      SELECT gen_random_uuid() AS u1,
             gen_random_uuid() AS u2,
             gen_random_uuid() AS u3
    `),
};

export default example;
