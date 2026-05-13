import { pgSchema, serial, text, integer, customType } from 'drizzle-orm/pg-core';
import { sql } from 'drizzle-orm';

export const m = pgSchema('m_advanced_types');

// tstzrange 在 drizzle 内没有内置列类型，用 customType 包一层。
// 数据形态为 PG 返回的字符串字面量，如 '["2026-05-12 09:00+00","2026-05-12 10:00+00")'。
const tstzrange = customType<{ data: string; notNull: true }>({
  dataType() {
    return 'tstzrange';
  },
});

export const users = m.table('users', {
  id: serial('id').primaryKey(),
  name: text('name').notNull(),
  age: integer('age').notNull(),
  // age_group 在 DB 层是 GENERATED ALWAYS AS (...) STORED 列（见 seed.sql）。
  // drizzle 只需知道它存在，SELECT 即可；写入由 DB 拒绝（参见 generated-column-write-fails example）。
  ageGroup: text('age_group').generatedAlwaysAs(
    sql`CASE WHEN age < 18 THEN 'minor' WHEN age < 60 THEN 'adult' ELSE 'senior' END`,
  ),
  tags: text('tags').array().notNull().default(sql`'{}'::text[]`),
});

export const bookings = m.table('bookings', {
  id: serial('id').primaryKey(),
  room: text('room').notNull(),
  during: tstzrange('during').notNull(),
});
