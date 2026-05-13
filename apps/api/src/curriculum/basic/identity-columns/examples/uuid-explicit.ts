import { sql } from 'drizzle-orm';
import type { ExampleDef } from '../../../types.ts';

const example: ExampleDef = {
  id: 'uuid-explicit',
  title: '显式给 UUID 字面量',
  support: 'partial',
  display: {
    sql: `INSERT INTO t_uuid (id, name)
VALUES ('00000000-0000-0000-0000-000000000099'::uuid, 'manual-uuid')
ON CONFLICT (id) DO UPDATE
  SET name = EXCLUDED.name || '_' || floor(random() * 10000)::text
RETURNING id, name;`,
    drizzle: `import { sql } from 'drizzle-orm';

await db.execute(sql\`
  INSERT INTO t_uuid (id, name)
  VALUES ('00000000-0000-0000-0000-000000000099'::uuid, 'manual-uuid')
  ON CONFLICT (id) DO UPDATE
    SET name = EXCLUDED.name || '_' || floor(random() * 10000)::text
  RETURNING id, name
\`);`,
  },
  execute: (db) =>
    db.execute(sql`
      INSERT INTO t_uuid (id, name)
      VALUES ('00000000-0000-0000-0000-000000000099'::uuid, 'manual-uuid')
      ON CONFLICT (id) DO UPDATE
        SET name = EXCLUDED.name || '_' || floor(random() * 10000)::text
      RETURNING id, name
    `),
};

export default example;
