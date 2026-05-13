import { sql } from 'drizzle-orm';
import type { ExampleDef } from '../../../types.ts';
import { tSerial } from '../schema.ts';

const example: ExampleDef = {
  id: 'serial-insert-default',
  title: 'SERIAL：不传 id 让序列推进',
  support: 'full',
  display: {
    sql: `INSERT INTO t_serial (name)
VALUES ('row-' || floor(random() * 10000)::text)
RETURNING id, name;`,
    drizzle: `import { sql } from 'drizzle-orm';
import { tSerial } from './schema';

await db
  .insert(tSerial)
  .values({ name: sql\`'row-' || floor(random() * 10000)::text\` })
  .returning({ id: tSerial.id, name: tSerial.name });`,
  },
  execute: (db) =>
    db
      .insert(tSerial)
      .values({ name: sql`'row-' || floor(random() * 10000)::text` })
      .returning({ id: tSerial.id, name: tSerial.name }),
};

export default example;
