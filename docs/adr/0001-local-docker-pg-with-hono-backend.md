# ADR-0001: 使用本地 Docker PostgreSQL + Hono 后端（而非 PGlite 或 Serverless）

- **状态**: Accepted
- **日期**: 2026-05-12

## 背景

`learn.md` 要求"用户点击 → 真实 INSERT，查询 → 真实 SELECT"，这意味着必须有一个真正能执行 SQL 的运行时。备选方案有三：

- **A. PGlite（PG 编译为 WASM，跑在浏览器）**：零部署、每个标签页一份独立数据；缺失 PostGIS / pgvector / 复制 / WAL / pg_stat 等高级主题。
- **B. 本地 Docker PG + 后端服务**：完整 PG 功能；需要写后端、需要本地 Docker。
- **C. Serverless PG（Neon/Supabase HTTP driver，浏览器直连）**：不写后端；需注册账号 + 暴露连接串 + 用 RLS 控权限。

## 决策

选择 **B**：本地 Docker 起 PostgreSQL，后端用 **Hono** 暴露 API，前端通过 HTTP 调后端。drizzle-orm 跑在后端。

## 理由

- 学习目标包含「高级阶段」（VACUUM、pg_stat、WAL、复制、扩展生态），PGlite 在这些主题上演示能力不足，会让学习体验在后期断层。
- 本地 Docker 单用户、localhost-only 场景下，无需考虑"暴露连接串"或"多租户隔离"，复杂度比 C 低。
- Hono 体积小、API 简洁，适合一个以演示为主、不需要复杂业务逻辑的后端。

## 后果

- 必须维护一个 `docker-compose.yml` 起 PG，README 必须说明如何启动。
- 前后端分离 → 仓库需要至少两个目录（`apps/web` + `apps/api` 或类似布局）。
- 重置 / 隔离策略需要显式设计（见后续 ADR），因为不同模块共用同一个 PG 实例。

## 备选未选

- **A (PGlite)** 被否：上层 25 个学习模块中有 ~6 个无法真演示。
- **C (Serverless)** 被否：依赖外部账号、需要处理凭据管理，对单人本地学习项目过重。
