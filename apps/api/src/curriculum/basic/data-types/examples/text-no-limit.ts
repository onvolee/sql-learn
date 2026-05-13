import { sql } from 'drizzle-orm';
import type { ExampleDef } from '../../../types.ts';
import { samples } from '../schema.ts';

// 用一个固定 id 做 upsert，反复运行不会膨胀表
const FIXED_ID = 1001;
const longText = 'x'.repeat(500);

const example: ExampleDef = {
  id: 'text-no-limit',
  title: 'text 任意长度，无字符上限',
  support: 'full',
  display: {
    sql: `INSERT INTO samples (id, s_text)
VALUES (1001, repeat('x', 500))
ON CONFLICT (id) DO UPDATE
  SET s_text = EXCLUDED.s_text
RETURNING id, length(s_text) AS text_length;`,
    drizzle: `import { sql } from 'drizzle-orm';
import { samples } from './schema';

await db
  .insert(samples)
  .values({ id: 1001, sText: 'x'.repeat(500) })
  .onConflictDoUpdate({
    target: samples.id,
    set: { sText: sql\`EXCLUDED.s_text\` },
  })
  .returning({
    id: samples.id,
    textLength: sql<number>\`length(s_text)\`.as('text_length'),
  });`,
  },
  execute: (db) =>
    db
      .insert(samples)
      .values({ id: FIXED_ID, sText: longText })
      .onConflictDoUpdate({
        target: samples.id,
        set: { sText: sql`EXCLUDED.s_text` },
      })
      .returning({
        id: samples.id,
        textLength: sql<number>`length(s_text)`.as('text_length'),
      }),
};

export default example;
