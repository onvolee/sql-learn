import { sql } from 'drizzle-orm';
import type { ExampleDef } from '../../../types.ts';

const example: ExampleDef = {
  id: 'show-cost-params',
  title: '查看 planner cost 参数默认值',
  support: 'partial',
  display: {
    sql: `SELECT name, setting, short_desc
FROM pg_settings
WHERE name IN (
  'seq_page_cost',
  'random_page_cost',
  'cpu_tuple_cost',
  'cpu_index_tuple_cost',
  'cpu_operator_cost'
)
ORDER BY name;`,
    drizzle: `import { sql } from 'drizzle-orm';

await db.execute(sql\`
  SELECT name, setting, short_desc
  FROM pg_settings
  WHERE name IN (
    'seq_page_cost',
    'random_page_cost',
    'cpu_tuple_cost',
    'cpu_index_tuple_cost',
    'cpu_operator_cost'
  )
  ORDER BY name
\`);`,
  },
  execute: (db) =>
    db.execute(sql`
      SELECT name, setting, short_desc
      FROM pg_settings
      WHERE name IN (
        'seq_page_cost',
        'random_page_cost',
        'cpu_tuple_cost',
        'cpu_index_tuple_cost',
        'cpu_operator_cost'
      )
      ORDER BY name
    `),
};

export default example;
