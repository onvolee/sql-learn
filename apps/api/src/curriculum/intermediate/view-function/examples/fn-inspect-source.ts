import { sql } from 'drizzle-orm';
import type { ExampleDef } from '../../../types.ts';

const example: ExampleDef = {
  id: 'fn-inspect-source',
  title: '从 pg_proc 读函数体源码',
  support: 'partial',
  display: {
    sql: `SELECT proname, pg_get_function_arguments(oid) AS args,
       pg_get_function_result(oid) AS returns,
       prosrc
FROM pg_proc
WHERE pronamespace = current_schema()::regnamespace
  AND proname = 'fn_region_total';`,
    drizzle: `import { sql } from 'drizzle-orm';

await db.execute(sql\`
  SELECT proname,
         pg_get_function_arguments(oid) AS args,
         pg_get_function_result(oid) AS returns,
         prosrc
  FROM pg_proc
  WHERE pronamespace = current_schema()::regnamespace
    AND proname = 'fn_region_total'
\`);`,
  },
  execute: (db) =>
    db.execute(sql`
      SELECT proname,
             pg_get_function_arguments(oid) AS args,
             pg_get_function_result(oid) AS returns,
             prosrc
      FROM pg_proc
      WHERE pronamespace = current_schema()::regnamespace
        AND proname = 'fn_region_total'
    `),
};

export default example;
