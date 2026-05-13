import { sql } from 'drizzle-orm';
import type { ExampleDef } from '../../../types.ts';
import { items } from '../schema.ts';

const example: ExampleDef = {
  id: 'array-column',
  title: '数组列：列出有 tag 的行',
  support: 'partial',
  display: {
    sql: `SELECT id, name, tags
FROM items
WHERE tags IS NOT NULL
  AND array_length(tags, 1) > 0
ORDER BY id;`,
    drizzle: `import { sql } from 'drizzle-orm';
import { items } from './schema';

await db
  .select({ id: items.id, name: items.name, tags: items.tags })
  .from(items)
  .where(sql\`\${items.tags} IS NOT NULL AND array_length(\${items.tags}, 1) > 0\`)
  .orderBy(items.id);`,
  },
  execute: (db) =>
    db
      .select({ id: items.id, name: items.name, tags: items.tags })
      .from(items)
      .where(sql`${items.tags} IS NOT NULL AND array_length(${items.tags}, 1) > 0`)
      .orderBy(items.id),
};

export default example;
