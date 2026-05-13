import {
  pgSchema,
  serial,
  integer,
  bigint,
  numeric,
  real,
  text,
  varchar,
  char,
  date,
  timestamp,
  interval,
  boolean,
  uuid,
  jsonb,
} from 'drizzle-orm/pg-core';

export const m = pgSchema('m_data_types');

export const samples = m.table('samples', {
  id: serial('id').primaryKey(),
  nInt: integer('n_int'),
  nBig: bigint('n_big', { mode: 'bigint' }),
  nNum: numeric('n_num', { precision: 10, scale: 4 }),
  nReal: real('n_real'),
  sText: text('s_text'),
  sVarchar: varchar('s_varchar', { length: 10 }),
  sChar: char('s_char', { length: 5 }),
  tDate: date('t_date'),
  tTs: timestamp('t_ts', { withTimezone: false }),
  tTstz: timestamp('t_tstz', { withTimezone: true }),
  tInterval: interval('t_interval'),
  bBool: boolean('b_bool'),
  uUuid: uuid('u_uuid'),
  jJsonb: jsonb('j_jsonb'),
  aArr: text('a_arr').array(),
});
