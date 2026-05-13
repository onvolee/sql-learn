import { sql } from 'drizzle-orm';
import type { ExampleDef } from '../../../types.ts';
import { docs } from '../schema.ts';

const example: ExampleDef = {
  id: 'jsonb-set-update',
  title: 'jsonb_set 改写嵌套字段',
  support: 'partial',
  display: {
    sql: `UPDATE docs
SET body = jsonb_set(body, '{stats,views}', '100'::jsonb)
WHERE id = 1
RETURNING id, body -> 'stats' AS stats;`,
    drizzle: `import { eq, sql } from 'drizzle-orm';
import { docs } from './schema';

await db.execute(sql\`
  UPDATE \${docs}
  SET body = jsonb_set(body, '{stats,views}', '100'::jsonb)
  WHERE id = 1
  RETURNING id, body -> 'stats' AS stats
\`);`,
  },
  execute: (db) =>
    db.execute(sql`
      UPDATE ${docs}
      SET body = jsonb_set(body, '{stats,views}', '100'::jsonb)
      WHERE id = 1
      RETURNING id, body -> 'stats' AS stats
    `),
};

export default example;
