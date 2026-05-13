import { sql } from 'drizzle-orm';
import type { ExampleDef } from '../../../types.ts';

const example: ExampleDef = {
  id: 'trigger-inspect',
  title: '看本 schema 下所有触发器',
  support: 'partial',
  display: {
    sql: `SELECT trigger_name,
       event_manipulation AS event,
       action_timing      AS timing,
       event_object_table AS on_table,
       action_statement
FROM information_schema.triggers
WHERE trigger_schema = current_schema()
ORDER BY trigger_name;`,
    drizzle: `import { sql } from 'drizzle-orm';

await db.execute(sql\`
  SELECT trigger_name,
         event_manipulation AS event,
         action_timing      AS timing,
         event_object_table AS on_table,
         action_statement
  FROM information_schema.triggers
  WHERE trigger_schema = current_schema()
  ORDER BY trigger_name
\`);`,
  },
  execute: (db) =>
    db.execute(sql`
      SELECT trigger_name,
             event_manipulation AS event,
             action_timing      AS timing,
             event_object_table AS on_table,
             action_statement
      FROM information_schema.triggers
      WHERE trigger_schema = current_schema()
      ORDER BY trigger_name
    `),
};

export default example;
