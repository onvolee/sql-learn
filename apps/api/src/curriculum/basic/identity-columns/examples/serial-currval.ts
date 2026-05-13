import { sql } from 'drizzle-orm';
import type { ExampleDef } from '../../../types.ts';

const example: ExampleDef = {
  id: 'serial-currval',
  title: '查 SERIAL 列的隐式序列名 + 当前值',
  support: 'partial',
  display: {
    sql: `-- 先推进一次序列（currval 要求本会话调过 nextval）
SELECT nextval(pg_get_serial_sequence('t_serial', 'id')) AS next_id;

SELECT
  pg_get_serial_sequence('t_serial', 'id') AS seq_name,
  currval(pg_get_serial_sequence('t_serial', 'id')) AS current_value;`,
    drizzle: `import { sql } from 'drizzle-orm';

await db.execute(sql\`
  SELECT nextval(pg_get_serial_sequence('t_serial', 'id')) AS next_id
\`);

await db.execute(sql\`
  SELECT
    pg_get_serial_sequence('t_serial', 'id') AS seq_name,
    currval(pg_get_serial_sequence('t_serial', 'id')) AS current_value
\`);`,
  },
  execute: async (db) => {
    await db.execute(
      sql`SELECT nextval(pg_get_serial_sequence('t_serial', 'id')) AS next_id`,
    );
    return db.execute(sql`
      SELECT
        pg_get_serial_sequence('t_serial', 'id') AS seq_name,
        currval(pg_get_serial_sequence('t_serial', 'id')) AS current_value
    `);
  },
};

export default example;
