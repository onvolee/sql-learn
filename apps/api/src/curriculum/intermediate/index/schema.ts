import { pgSchema, bigserial, serial, text, timestamp, jsonb } from 'drizzle-orm/pg-core';

export const m = pgSchema('m_index');

export const events = m.table('events', {
  id: bigserial('id', { mode: 'bigint' }).primaryKey(),
  ts: timestamp('ts', { withTimezone: true }).notNull(),
  kind: text('kind').notNull(),
  payload: jsonb('payload').notNull(),
  tags: text('tags').array().notNull(),
});

export const places = m.table('places', {
  id: serial('id').primaryKey(),
  name: text('name').notNull(),
  location: text('location').notNull(),
});
