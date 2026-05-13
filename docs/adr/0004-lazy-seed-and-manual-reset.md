# ADR-0004: 模块状态采用"懒首次 seed + 手动重置"

- **状态**: Accepted
- **日期**: 2026-05-12

## 背景

每个 Module 有独立 PG schema（[[0003-per-module-pg-schema]]）之后，需要决定：

- 这个 schema **什么时候被创建并填入演示数据**？
- 用户把数据玩坏了 **怎么重置**？

候选：

- **a. 每次进页面都重置** —— 路由 mount → drop + create + seed
- **b. 懒首次 seed + 手动重置按钮** —— 首次进入自动 seed；之后持久化；显式按钮触发 reset
- **c. 永远手动** —— 用户必须先点"初始化"才能用
- **d. 检测损坏自动修** —— 进页面查 schema 完好性，缺表才补

## 决策

选择 **b**：

1. **后端两个端点**：
   - `POST /api/modules/:slug/ensure`：幂等。`m_<slug>` 不存在则 `CREATE SCHEMA + seeds/<slug>.sql`，存在则 no-op。前端每个模块 `onMounted` 调一次。
   - `POST /api/modules/:slug/reset`：`DROP SCHEMA … CASCADE; CREATE …; <seed>`。前端按钮调用，**带二次确认**。
2. **Seed 用纯 SQL 文件** `seed.sql`，不用 drizzle-kit migration。理由：Seed 本身是教学内容（这就是你要学的 `CREATE TABLE`、`INSERT INTO`），不该被工具抽象掉。
3. **重置无 undo**——学习项目，对 `DROP CASCADE` 保留敬畏心，是教学意图本身。
4. **数据持久化到 Docker named volume `pgdata`**——`docker compose down` 不丢，只有 `down -v` 才清。

## 理由

- **a 杀死了"练习"维度**：用户没法"先插一行，再查一下"，每次刷新都丢
- **c 的首次体验**会让人困惑（"为什么打开模块表是空的？"）
- **d 行为像魔法**：用户做了 DDL 操作（`DROP TABLE`）后被自动救回，行为难预测，副作用调试痛苦
- **b** 既保证"教程截图永远对得上 seed 初始状态"，又允许"玩坏了点重置"

## 后果

- DDL Module 的 `seed.sql` 内容**很少或为空**——因为教学内容本身就是让用户运行 `CREATE TABLE`，预先 seed 会导致"relation already exists"错误
- 重复 seed 是已知冗余（25 个 Module 各自 seed `users` / `orders` 等）——可接受，每个 seed 量级仅几十行
- ensure 端点是 schema 存在的**唯一**入口；任何对 schema 不存在场景的恢复都通过 reset 走

## 备选未选

- **a (每次重置)** 被否：杀掉练习场景，纯演示模式没意义
- **c (永远手动)** 被否：首次体验差
- **d (自动修复)** 被否：行为不可预测
