import { sql } from 'drizzle-orm';
import type { ExampleDef } from '../../../types.ts';

const example: ExampleDef = {
  id: 'identity-explicit-override',
  title: 'BY DEFAULT 模式下手动给 id',
  support: 'partial',
  display: {
    sql: `-- BY DEFAULT 允许显式赋值，给一个远离序列当前值的大数避免冲突
INSERT INTO t_identity (id, name)
VALUES (10001, 'manual-' || floor(random() * 10000)::text)
ON CONFLICT (id) DO UPDATE
  SET name = EXCLUDED.name
RETURNING id, name;`,
    drizzle: `import { sql } from 'drizzle-orm';

await db.execute(sql\`
  INSERT INTO t_identity (id, name)
  VALUES (10001, 'manual-' || floor(random() * 10000)::text)
  ON CONFLICT (id) DO UPDATE
    SET name = EXCLUDED.name
  RETURNING id, name
\`);`,
  },
  execute: (db) =>
    db.execute(sql`
      INSERT INTO t_identity (id, name)
      VALUES (10001, 'manual-' || floor(random() * 10000)::text)
      ON CONFLICT (id) DO UPDATE
        SET name = EXCLUDED.name
      RETURNING id, name
    `),
};

export default example;
