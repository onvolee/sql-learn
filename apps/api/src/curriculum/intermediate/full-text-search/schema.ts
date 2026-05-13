import { pgSchema, serial, text } from 'drizzle-orm/pg-core';

export const m = pgSchema('m_full_text_search');

// 注意：真实表里还有一个 GENERATED tsvector 列 `tsv`（参见 seed.sql），
// drizzle 没有内建的 tsvector 类型，本 schema 不声明它；
// 涉及 `tsv` 的 example 用 sql 模板直接写裸 SQL。
export const articles = m.table('articles', {
  id: serial('id').primaryKey(),
  title: text('title').notNull(),
  body: text('body').notNull(),
  lang: text('lang').notNull().default('english'),
});
