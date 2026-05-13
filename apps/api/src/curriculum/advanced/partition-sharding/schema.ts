import { pgSchema } from 'drizzle-orm/pg-core';

// drizzle 对 PG 原生声明式分区（PARTITION BY ...）支持有限，
// 本章不通过 drizzle DSL 声明表，全部由 seed.sql 用原始 DDL 建。
// 这里只占住 schema 名，让 ensure() 端点和 search_path 派生逻辑识别本模块。
export const m = pgSchema('m_partition_sharding');
