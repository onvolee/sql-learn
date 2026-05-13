import { sql } from 'drizzle-orm';
import type { ExampleDef } from '../../../types.ts';
import { bookings } from '../schema.ts';

const example: ExampleDef = {
  id: 'range-overlap',
  title: '与给定区间重叠的预订（&&）',
  support: 'partial',
  display: {
    sql: `SELECT id, room, during
FROM bookings
WHERE during && tstzrange(
  '2026-05-12 09:45+00',
  '2026-05-12 10:15+00',
  '[)'
);
-- seed 中跨 09:45–10:15 的多条 booking 都会命中`,
    drizzle: `import { sql } from 'drizzle-orm';
import { bookings } from './schema';

await db.execute(sql\`
  SELECT id, room, during
  FROM \${bookings}
  WHERE during && tstzrange(
    '2026-05-12 09:45+00',
    '2026-05-12 10:15+00',
    '[)'
  )
\`);`,
  },
  execute: (db) =>
    db.execute(sql`
      SELECT id, room, during
      FROM ${bookings}
      WHERE during && tstzrange(
        '2026-05-12 09:45+00',
        '2026-05-12 10:15+00',
        '[)'
      )
    `),
};

export default example;
