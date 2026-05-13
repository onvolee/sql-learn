import { sql } from 'drizzle-orm';
import type { ExampleDef } from '../../../types.ts';

const example: ExampleDef = {
  id: 'inspect-storage-difference',
  title: 'json 保留原文 vs jsonb 去重',
  support: 'partial',
  display: {
    sql: `SELECT
  '{"a":1, "a":2}'::json  AS as_json,
  '{"a":1, "a":2}'::jsonb AS as_jsonb;`,
    drizzle: `import { sql } from 'drizzle-orm';

await db.execute(sql\`
  SELECT
    '{"a":1, "a":2}'::json  AS as_json,
    '{"a":1, "a":2}'::jsonb AS as_jsonb
\`);`,
  },
  execute: (db) =>
    db.execute(sql`
      SELECT
        '{"a":1, "a":2}'::json  AS as_json,
        '{"a":1, "a":2}'::jsonb AS as_jsonb
    `),
};

export default example;
