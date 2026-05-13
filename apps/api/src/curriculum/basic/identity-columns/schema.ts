import { pgSchema, serial, integer, text, uuid } from 'drizzle-orm/pg-core';
import { sql } from 'drizzle-orm';

export const m = pgSchema('m_identity_columns');

// 经典 SERIAL：integer + 隐式 SEQUENCE + 默认 nextval。
export const tSerial = m.table('t_serial', {
  id: serial('id').primaryKey(),
  name: text('name').notNull(),
});

// SQL 标准 IDENTITY：drizzle 0.45+ 支持 generatedByDefaultAsIdentity。
export const tIdentity = m.table('t_identity', {
  id: integer('id').primaryKey().generatedByDefaultAsIdentity(),
  name: text('name').notNull(),
});

// UUID 主键：默认值是 PG 13+ 内建的 gen_random_uuid()。
export const tUuid = m.table('t_uuid', {
  id: uuid('id')
    .primaryKey()
    .default(sql`gen_random_uuid()`),
  name: text('name').notNull(),
});
