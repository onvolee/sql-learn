import { isNotNull } from 'drizzle-orm';
import type { ExampleDef } from '../../../types.ts';
import { items } from '../schema.ts';

const example: ExampleDef = {
  id: 'jsonb-column',
  title: 'JSONB 列：列出 data 非 NULL 的行',
  support: 'full',
  display: {
    sql: `SELECT id, name, data
FROM items
WHERE data IS NOT NULL
ORDER BY id;`,
    drizzle: `import { isNotNull } from 'drizzle-orm';
import { items } from './schema';

await db
  .select({ id: items.id, name: items.name, data: items.data })
  .from(items)
  .where(isNotNull(items.data))
  .orderBy(items.id);`,
  },
  execute: (db) =>
    db
      .select({ id: items.id, name: items.name, data: items.data })
      .from(items)
      .where(isNotNull(items.data))
      .orderBy(items.id),
};

export default example;
