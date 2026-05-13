import { pgSchema, serial, text, numeric } from 'drizzle-orm/pg-core';

export const m = pgSchema('m_sql_syntax');

export const employees = m.table('employees', {
  id: serial('id').primaryKey(),
  name: text('name').notNull(),
  dept: text('dept').notNull(),
  salary: numeric('salary', { precision: 10, scale: 2 }).notNull(),
});
