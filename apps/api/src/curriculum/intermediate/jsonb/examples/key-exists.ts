import { sql } from 'drizzle-orm';
import type { ExampleDef } from '../../../types.ts';
import { docs } from '../schema.ts';

const example: ExampleDef = {
  id: 'key-exists',
  title: '? 顶层键是否存在',
  support: 'partial',
  display: {
    sql: `SELECT
  id,
  title,
  body ? 'stats'                            AS has_stats,
  body ?| ARRAY['stats','metrics']          AS has_any,
  body ?& ARRAY['author','tags','stats']    AS has_all
FROM docs
ORDER BY id
LIMIT 4;`,
    drizzle: `import { sql } from 'drizzle-orm';
import { docs } from './schema';

await db.execute(sql\`
  SELECT
    id,
    title,
    body ? 'stats'                            AS has_stats,
    body ?| ARRAY['stats','metrics']          AS has_any,
    body ?& ARRAY['author','tags','stats']    AS has_all
  FROM \${docs}
  ORDER BY id
  LIMIT 4
\`);`,
  },
  execute: (db) =>
    db.execute(sql`
      SELECT
        id,
        title,
        body ? 'stats'                            AS has_stats,
        body ?| ARRAY['stats','metrics']          AS has_any,
        body ?& ARRAY['author','tags','stats']    AS has_all
      FROM ${docs}
      ORDER BY id
      LIMIT 4
    `),
};

export default example;
