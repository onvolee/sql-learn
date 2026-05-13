# 章节生成任务：21. 配置与调优

> **Agent 开工前必读**：`docs/chapter-template/chapter-template.md`
> 本文件只提供本章节的具体决策与任务清单。

## 章节基本信息

| 字段 | 值 |
|---|---|
| 大纲来源 | `postgresql-study-outline.md` → 「三、高级阶段 → 5. 配置与调优」 |
| group | `advanced` |
| slug | `config-tuning` |
| schema | `m_config_tuning` |
| order | 5 |
| 读者画像 | 已会 EXPLAIN（→ ch17）、知道内存结构（→ ch20） |

## 章节特殊性

`postgresql.conf` 是文件配置，本课程改不了。**所有 example 用 `SHOW` 看默认值或 `SET LOCAL` 当前事务内改**，不展开重启后才生效的全局改动。

## 教学边界

- 覆盖：postgresql.conf 概念、关键内存参数、planner cost 参数、连接相关、连接池（PgBouncer 点到为止）
- 不展开：参数计算工具（pgtune）、操作系统级调优、容器化部署

## 任务清单

### Task 1 — 写 `schema.ts`

`probe(id serial PK, val text NOT NULL)`

### Task 2 — 写 `seed.sql`

`probe` 5 行。

### Task 3 — 写 Section 1：参数从哪里来

- **定义段要点**：`postgresql.conf` 主配置 / `ALTER SYSTEM SET` 写入 `postgresql.auto.conf`（重启或 reload 生效）/ 会话级 `SET` / 事务级 `SET LOCAL` / 用户级 `ALTER USER ... SET` / 数据库级 `ALTER DATABASE ... SET` / 优先级从高到低
- **语法骨架**：ASCII，5 种 set 方式 + 优先级序
- **mermaid**：加。画参数解析优先级金字塔：SET LOCAL > SET > ALTER USER > ALTER DATABASE > postgresql.conf
- **Examples**：
  - `show-vs-current-setting` — `SHOW work_mem; SELECT current_setting('work_mem');`；`support: 'partial'`
  - `set-local-effect` — 同 example 内：`SHOW work_mem;` → `SET LOCAL work_mem = '32MB';` → `SHOW work_mem;`（事务结束后还原）；`support: 'partial'`
  - `pg-settings-source` — `SELECT name, setting, source, sourcefile FROM pg_settings WHERE name IN ('work_mem', 'shared_buffers', 'max_connections')`；`support: 'partial'`

### Task 4 — 写 Section 2：内存类参数

- **定义段要点**：`shared_buffers` 一般取主机 RAM 的 25% / `work_mem` 单个 sort/hash 操作上限，乘连接数才是潜在峰值 / `maintenance_work_mem` VACUUM/CREATE INDEX 时用 / `effective_cache_size` planner 估计可用 OS cache + shared_buffers 总和
- **语法骨架**：ASCII，4 个参数列表
- **mermaid**：不加
- **Examples**：
  - `show-all-memory-params` — `SELECT name, setting, unit, short_desc FROM pg_settings WHERE name IN ('shared_buffers', 'work_mem', 'maintenance_work_mem', 'effective_cache_size')`；`support: 'partial'`

### Task 5 — 写 Section 3：Planner cost 参数

- **定义段要点**：`seq_page_cost`（默认 1）/ `random_page_cost`（默认 4，SSD 建议 1.1）/ `cpu_tuple_cost` / `cpu_index_tuple_cost` / `cpu_operator_cost` / planner 用这些算各计划的「成本」 / `random_page_cost` 偏高时 planner 倾向 Seq Scan，偏低倾向 Index
- **语法骨架**：ASCII，5 个 cost 参数
- **mermaid**：不加
- **Examples**：
  - `show-cost-params` — `SELECT name, setting FROM pg_settings WHERE name LIKE '%page_cost%' OR name LIKE 'cpu_%'`；`support: 'partial'`
  - `set-local-random-page-cost` — 看 SET LOCAL random_page_cost = '1.1' 后某 EXPLAIN 计划是否切换（需先在 probe 上建索引）；`support: 'partial'`

### Task 6 — 写 Section 4：连接相关

- **定义段要点**：`max_connections` 全局上限 / 每连接一个进程，连接数高内存吃紧 / `idle_in_transaction_session_timeout` 防止长事务 / `statement_timeout` 单语句超时
- **语法骨架**：ASCII，4 个参数
- **mermaid**：不加
- **Examples**：
  - `show-connection-params` — `SHOW max_connections; SHOW idle_in_transaction_session_timeout; SHOW statement_timeout;`；`support: 'partial'`
  - `set-local-statement-timeout` — `SET LOCAL statement_timeout = '100ms'; SELECT pg_sleep(0.05);`（不超时）→ 如果改成 `pg_sleep(0.2)` 期望超时；`support: 'partial'`

### Task 7 — 写 Section 5：连接池（PgBouncer 点到为止）

- **定义段要点**：PG 进程模型让连接代价高 / 应用与 PG 之间放 PgBouncer（最常见） / 三种 pool mode：session / transaction / statement / transaction mode 不能用 prepared statement / 本课程教学环境不演示部署
- **语法骨架**：ASCII，三种 pool mode 对比表
- **mermaid**：加。画 App → PgBouncer pool → 少量物理连接 → PG
- **Examples**：
  - `client-side-pool-comparison` — 仅注释/文档示例，不做真实 SQL；可写成 `SELECT 'pgbouncer: transaction mode → no prepared statements' AS note`；`support: 'partial'`

### Task 8 — 写 `index.ts`

`examples` 数组约 9 个。

### Task 9 — 注册到 `registry.ts`

## 完成验收 Checklist

### 内容边界
- [ ] 5 个 Section 主语依次为：参数来源、内存类、planner cost、连接相关、连接池
- [ ] 不展开 pgtune / 操作系统调优
- [ ] Section 1、5 用 mermaid，label 无裸 `<` `>` `|`

### 重入安全
- [ ] 所有 `SET LOCAL` 仅影响当前事务，结束后自动还原（框架保证）
- [ ] 不使用 `ALTER SYSTEM`（不可重入且影响全局）

### 关键 Example 行为
- [ ] `set-local-effect` 中 SET LOCAL 后 SHOW 返回 `32MB`
- [ ] `set-local-statement-timeout` 在 timeout 短时报 57014（query_canceled）
