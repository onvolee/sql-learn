import { sql } from 'drizzle-orm';
import type { ExampleDef } from '../../../types.ts';
import { tUuid } from '../schema.ts';

const example: ExampleDef = {
  id: 'uuid-default-insert',
  title: 'UUID：不传 id 由 gen_random_uuid() 生成',
  support: 'partial',
  display: {
    sql: `INSERT INTO t_uuid (name)
VALUES ('row-' || floor(random() * 10000)::text)
RETURNING id, name;`,
    drizzle: `import { sql } from 'drizzle-orm';
import { tUuid } from './schema';

// uuid 列在 schema.ts 里声明了 .default(sql\`gen_random_uuid()\`)，
// 所以这里不传 id 也会自动生成
await db
  .insert(tUuid)
  .values({ name: sql\`'row-' || floor(random() * 10000)::text\` })
  .returning({ id: tUuid.id, name: tUuid.name });`,
  },
  execute: (db) =>
    db
      .insert(tUuid)
      .values({ name: sql`'row-' || floor(random() * 10000)::text` })
      .returning({ id: tUuid.id, name: tUuid.name }),
};

export default example;
