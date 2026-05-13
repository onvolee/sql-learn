# 章节生成任务：19. 监控与诊断

> **Agent 开工前必读**：`docs/chapter-template/chapter-template.md`
> 本文件只提供本章节的具体决策与任务清单。

## 章节基本信息

| 字段 | 值 |
|---|---|
| 大纲来源 | `postgresql-study-outline.md` → 「三、高级阶段 → 3. 监控与诊断」 |
| group | `advanced` |
| slug | `monitoring` |
| schema | `m_monitoring` |
| order | 3 |
| 读者画像 | 已会 EXPLAIN（→ ch17）、VACUUM（→ ch18） |

## 教学边界

- 覆盖：`pg_stat_*` 视图族、`pg_locks`、`pg_stat_statements`（extension）点到为止、慢查询日志
- 不展开：第三方监控工具（Datadog / pganalyze）、操作系统层指标

## 任务清单

### Task 1 — 写 `schema.ts`

`probe(id serial PK, val text NOT NULL)` — 仅为产生少量活动让统计视图有内容。

### Task 2 — 写 `seed.sql`

`probe` 100 行。

### Task 3 — 写 Section 1：pg_stat_database / pg_stat_user_tables

- **定义段要点**：`pg_stat_database` 库级指标（提交数、回滚数、命中率、tup_returned / tup_fetched） / `pg_stat_user_tables` 表级（顺序扫 / 索引扫次数、live / dead tuple、最近 VACUUM / ANALYZE 时间）
- **语法骨架**：ASCII，两个视图常用列
- **mermaid**：不加
- **Examples**：
  - `db-level-stats` — `SELECT datname, xact_commit, xact_rollback, blks_hit, blks_read FROM pg_stat_database WHERE datname = current_database()`；`support: 'partial'`
  - `table-scan-stats` — `SELECT relname, seq_scan, idx_scan, n_live_tup, n_dead_tup FROM pg_stat_user_tables WHERE schemaname = 'm_monitoring'`；`support: 'partial'`
  - `cache-hit-ratio` — `SELECT sum(blks_hit)*1.0/nullif(sum(blks_hit+blks_read),0) AS hit_ratio FROM pg_stat_database`；`support: 'partial'`

### Task 4 — 写 Section 2：pg_stat_user_indexes / pg_statio_user_indexes

- **定义段要点**：`pg_stat_user_indexes` 索引被用了几次（idx_scan / idx_tup_read / idx_tup_fetch） / `pg_statio_*` IO 视角 / idx_scan = 0 的索引可能是「死索引」候选
- **语法骨架**：ASCII，两个视图常用列
- **mermaid**：不加
- **Examples**：
  - `index-usage` — `SELECT indexrelname, idx_scan, idx_tup_read FROM pg_stat_user_indexes WHERE schemaname = 'm_monitoring'`；`support: 'partial'`
  - `unused-index-candidates` — `SELECT indexrelname FROM pg_stat_user_indexes WHERE idx_scan = 0 AND schemaname = 'm_monitoring'`；`support: 'partial'`

### Task 5 — 写 Section 3：pg_stat_activity 与正在执行的查询

- **定义段要点**：`pg_stat_activity` 每个 backend 的状态、当前 query、wait_event、xact_start / state = 'active' 当前在跑、'idle in transaction' 危险信号 / 用 `pg_cancel_backend(pid)` 取消、`pg_terminate_backend(pid)` 杀
- **语法骨架**：ASCII，常用列 + 两个 admin 函数
- **mermaid**：不加
- **Examples**：
  - `current-activity` — `SELECT pid, state, query FROM pg_stat_activity WHERE datname = current_database()`；`support: 'partial'`
  - `idle-in-transaction-detect` — `SELECT pid, state, xact_start, query FROM pg_stat_activity WHERE state = 'idle in transaction'`；`support: 'partial'`

### Task 6 — 写 Section 4：pg_locks 与阻塞链

- **定义段要点**：`pg_locks` 当前持有 / 等待的锁 / 联 `pg_stat_activity` 看「谁在等谁」 / `pg_blocking_pids(pid)` 直接给阻塞者列表
- **语法骨架**：ASCII，常见 join：`pg_locks JOIN pg_stat_activity USING (pid)`
- **mermaid**：加。画两个 backend 互相 waiting 的阻塞图（与 ch11 死锁的环图区分：这里只画一向）
- **Examples**：
  - `current-locks` — `SELECT locktype, mode, granted, pid FROM pg_locks WHERE pid = pg_backend_pid()`；`support: 'partial'`
  - `blocking-chain-shape` — `SELECT pid, pg_blocking_pids(pid) FROM pg_stat_activity WHERE datname = current_database()`（多数返回空数组也是教学点）；`support: 'partial'`

### Task 7 — 写 Section 5：pg_stat_statements（扩展，点到为止）

- **定义段要点**：`pg_stat_statements` 扩展：聚合每条语句模板的累计执行次数、总耗时、平均耗时、IO / 必须 `CREATE EXTENSION pg_stat_statements`（绝大多数托管服务默认装） / 没装时本节示例返回错误是教学点
- **语法骨架**：ASCII，`CREATE EXTENSION IF NOT EXISTS pg_stat_statements` + `SELECT query, calls, mean_exec_time FROM pg_stat_statements ORDER BY mean_exec_time DESC LIMIT 10`
- **mermaid**：不加
- **Examples**：
  - `pg-stat-statements-check` — `SELECT extname FROM pg_extension WHERE extname = 'pg_stat_statements'`（看是否已装）；`support: 'partial'`
  - `top-slow-statements` — `SELECT query, calls, mean_exec_time FROM pg_stat_statements ORDER BY mean_exec_time DESC LIMIT 5`（未装时报 42P01 是教学点）；`support: 'partial'`

### Task 8 — 写 Section 6：慢查询日志

- **定义段要点**：`log_min_duration_statement` 设阈值（毫秒），超过的语句进日志 / `log_statement = 'all'` 全量记 / 日志收集靠日志服务，不直接 SQL 查 / 本节只演示如何看当前阈值与建议设置
- **语法骨架**：ASCII，关键参数 + `SHOW log_min_duration_statement`
- **mermaid**：不加
- **Examples**：
  - `show-slow-log-threshold` — `SHOW log_min_duration_statement; SHOW log_statement;`；`support: 'partial'`

### Task 9 — 写 `index.ts`

`examples` 数组约 12 个。

### Task 10 — 注册到 `registry.ts`

## 完成验收 Checklist

### 内容边界
- [ ] 6 个 Section 主语依次为：库/表级 stat、索引 stat、活动、锁、pg_stat_statements、慢查询日志
- [ ] pg_stat_statements 仅点到为止，不要求 example 必须成功
- [ ] Section 4 mermaid label 无裸 `<` `>` `|`

### 关键 Example 行为
- [ ] `current-activity` 至少返回 1 行（本会话）
- [ ] `cache-hit-ratio` 返回 0-1 之间的 numeric
- [ ] `pg-stat-statements-check` 在未装时返回 0 行，装了返回 1 行（都算合格）
