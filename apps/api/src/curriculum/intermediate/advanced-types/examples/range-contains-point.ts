import { sql } from 'drizzle-orm';
import type { ExampleDef } from '../../../types.ts';
import { bookings } from '../schema.ts';

const example: ExampleDef = {
  id: 'range-contains-point',
  title: '区间包含某时间点（@>）',
  support: 'partial',
  display: {
    sql: `SELECT id, room, during
FROM bookings
WHERE during @> TIMESTAMPTZ '2026-05-12 10:15+00'
ORDER BY id;`,
    drizzle: `import { sql } from 'drizzle-orm';
import { bookings } from './schema';

await db.execute(sql\`
  SELECT id, room, during
  FROM \${bookings}
  WHERE during @> TIMESTAMPTZ '2026-05-12 10:15+00'
  ORDER BY id
\`);`,
  },
  execute: (db) =>
    db.execute(sql`
      SELECT id, room, during
      FROM ${bookings}
      WHERE during @> TIMESTAMPTZ '2026-05-12 10:15+00'
      ORDER BY id
    `),
};

export default example;
