import { sql } from 'drizzle-orm';
import type { ExampleDef } from '../../../types.ts';

const example: ExampleDef = {
  id: 'equiv-of-df',
  title: '\\df 的等价 SQL — 列出当前 schema 的函数',
  support: 'partial',
  display: {
    sql: `SELECT proname,
       pg_get_function_result(oid)    AS result_type,
       pg_get_function_arguments(oid) AS arguments
FROM pg_proc
WHERE pronamespace = current_schema()::regnamespace
ORDER BY proname;`,
    drizzle: `import { sql } from 'drizzle-orm';

await db.execute(sql\`
  SELECT proname,
         pg_get_function_result(oid)    AS result_type,
         pg_get_function_arguments(oid) AS arguments
  FROM pg_proc
  WHERE pronamespace = current_schema()::regnamespace
  ORDER BY proname
\`);`,
  },
  execute: (db) =>
    db.execute(sql`
      SELECT proname,
             pg_get_function_result(oid)    AS result_type,
             pg_get_function_arguments(oid) AS arguments
      FROM pg_proc
      WHERE pronamespace = current_schema()::regnamespace
      ORDER BY proname
    `),
};

export default example;
