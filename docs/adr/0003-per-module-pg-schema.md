# ADR-0003: 每个 Module 一个独立 PG schema（`m_<slug>`）

- **状态**: Accepted
- **日期**: 2026-05-12

## 背景

`learn.md` 里明确提出待评估点："每个菜单一个 PG 数据库 vs 同一个 DB 不同表"。在敲定本地 Docker + Hono 后端（[[0001-local-docker-pg-with-hono-backend]]）之后，模块间的数据隔离方式需要一个具体方案。

候选：

- **a. 每 Module 独立 database** —— `CREATE DATABASE m_joins; CREATE DATABASE m_window;` ×25
- **b. 单 DB，每 Module 一个 schema** —— `CREATE SCHEMA m_joins; CREATE SCHEMA m_window;`
- **c. 单 DB 单 schema，表名加前缀** —— `m_joins_users`, `m_window_orders`
- **d. 单 DB 单 schema 共享表 + 模块专属表** —— `public.users` 全模块只读 + `m_xxx.scratch` 模块写

## 决策

选择 **b**：每个 Module 拥有一个 PG schema，名为 `m_<slug>`（slug 中的 `-` 转 `_`）。

## 理由

1. **直接映射 [[CONTEXT.md]] 里的 Module 概念**：25 个 Module → 25 个 schema，前后端结构同构
2. **重置最干净**：`DROP SCHEMA m_xxx CASCADE; CREATE SCHEMA …;` 一行清空，比 a 切连接、c 删多表都简单
3. **顺便教学**：「Schema 与命名空间」是大纲入门第 8 个主题，整个项目结构本身就是这一主题的活教材
4. **DDL Module 天然安全**：用户在 `m_basic_curd` 里 `DROP TABLE users` 不影响 `m_joins.users`
5. **drizzle 一等支持**：`pgSchema('m_joins').table(...)` 是 drizzle 官方 API

## 后果

- 跨 Module 演示数据（users / orders / products）需在多个 schema 里**重复 seed**——可接受，因为每个 seed 量级仅几十行，且独立 seed 保证每个 Module 的"故事"自洽，不会被其他 Module 的修改污染（见 [[0004-lazy-seed-and-manual-reset]]）
- `search_path` 必须每次请求显式设置成当前 Module 的 schema（见 [[0002-module-isolation-via-search-path]]）
- 不演示「跨 database 隔离」主题——大纲没要求

## 备选未选

- **a (database-per-module)** 被否：切连接成本高、25 个连接池没必要
- **c (前缀表名)** 被否：丑、命名冲突风险、不符合 PG 真实用法
- **d (共享 + 专属)** 被否：跨 Module 状态污染会让教程截图对不上（见 [[0004-lazy-seed-and-manual-reset]] 同样的理由）
