import { sql } from 'drizzle-orm';
import type { ExampleDef } from '../../../types.ts';

const example: ExampleDef = {
  id: 'client-side-pool-comparison',
  title: 'PgBouncer 三种 pool mode 取舍速记',
  support: 'partial',
  display: {
    sql: `-- 本课程不部署 PgBouncer，这里只把三种 pool mode 的限制写成一张参考表。
SELECT * FROM (VALUES
  ('session',     'connection close',  'no restriction'),
  ('transaction', 'transaction end',   'no prepared statement / no session state'),
  ('statement',   'statement end',     'no transaction / no cross-statement state')
) AS t(pool_mode, release_at, restriction);`,
    drizzle: `import { sql } from 'drizzle-orm';

await db.execute(sql\`
  SELECT * FROM (VALUES
    ('session',     'connection close',  'no restriction'),
    ('transaction', 'transaction end',   'no prepared statement / no session state'),
    ('statement',   'statement end',     'no transaction / no cross-statement state')
  ) AS t(pool_mode, release_at, restriction)
\`);`,
  },
  execute: (db) =>
    db.execute(sql`
      SELECT * FROM (VALUES
        ('session',     'connection close',  'no restriction'),
        ('transaction', 'transaction end',   'no prepared statement / no session state'),
        ('statement',   'statement end',     'no transaction / no cross-statement state')
      ) AS t(pool_mode, release_at, restriction)
    `),
};

export default example;
