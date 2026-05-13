import { sql } from 'drizzle-orm';
import type { ExampleDef } from '../../../types.ts';

const example: ExampleDef = {
  id: 'event-trigger-list',
  title: '列出库内所有事件触发器',
  support: 'partial',
  display: {
    sql: `-- 事件触发器是库级对象，不属于任何 schema
-- 普通教学库通常没有，返回空结果集也是教学点
SELECT evtname, evtevent, evtenabled
FROM pg_event_trigger
ORDER BY evtname;`,
    drizzle: `import { sql } from 'drizzle-orm';

await db.execute(sql\`
  SELECT evtname, evtevent, evtenabled
  FROM pg_event_trigger
  ORDER BY evtname
\`);`,
  },
  execute: (db) =>
    db.execute(sql`
      SELECT evtname, evtevent, evtenabled
      FROM pg_event_trigger
      ORDER BY evtname
    `),
};

export default example;
