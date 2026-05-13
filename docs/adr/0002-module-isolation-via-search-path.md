# ADR-0002: 模块隔离用 search_path + 单 app 角色，不用每模块独立 PG 角色

- **状态**: Accepted
- **日期**: 2026-05-12

## 背景

按 [[CONTEXT.md]] 的设计，每个 Module 拥有独立 PG schema (`m_<slug>`)。同一个 Docker PostgreSQL 实例里有 25+ 个 schema 并存，需要决定：

- **怎么防止"模块 A 的 SQL 误动模块 B 的表"？**
- **怎么防止用户开 devtools 后写恶意 SQL（如 `DROP DATABASE`）？**

候选方案：

- **a. 后端用超管 `postgres` 角色直连** —— 零防护，devtools 一行 `DROP DATABASE` 完蛋
- **b. 单一非超管 app 角色 + per-request `SET LOCAL search_path = m_<slug>` + `statement_timeout`** —— 中等防护
- **c. 每模块独立 PG 角色（`app_m_joins` 等），授权只限自己的 schema** —— 强防护，但要管理 25+ 角色的 GRANT/REVOKE

## 决策

选择 **b**：

1. **单一 app 角色**：`CREATE ROLE app WITH LOGIN PASSWORD 'app'`，非超管，但拥有所有 `m_*` schema
2. **per-request `search_path`**：每个 `/exec` 请求开事务，事务里先 `SET LOCAL search_path = m_<slug>, pg_catalog`，再执行用户 SQL
3. **per-request `statement_timeout`**：默认 `SET LOCAL statement_timeout = '5s'`，Example 可声明自定义超时（如「索引性能对比」需 30s）

## 理由

- 项目是 **localhost 单用户学习应用**，威胁模型不是恶意外部攻击者，而是"自己手滑或开 devtools 把自己玩坏"
- 单 app 角色 + 非超管已经挡住真正危险的操作（动系统表、`DROP DATABASE`、安装扩展），剩下的"动错 schema"靠 `search_path` 把默认命名空间限定在当前 Module 即可
- 25 个独立角色 + 对应的 GRANT/REVOKE 脚本对单人学习项目过重，且没有真实威胁需要这层防护

## 后果

- `/exec` 端点强制走事务并设置 `SET LOCAL`，不能跳过
- 用户在 SQL 里手动写 `m_other_module.users` 仍然能跨 schema（角色对所有 `m_*` 都有权）——可接受：UI 不暴露 SQL 输入框，前端发的是 `exampleId` 而非任意字符串，开 devtools 自损不阻止
- 未来如果项目变成公开演示站，本 ADR 需要重新评估，届时方案 c（每模块独立角色）才是真正必要的

## 备选未选

- **a (超管直连)** 被否：无防护，等同没有边界
- **c (每模块独立角色)** 被否：单用户场景下成本远大于收益
