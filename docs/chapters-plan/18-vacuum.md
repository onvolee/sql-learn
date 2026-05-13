# 章节生成任务：18. VACUUM 与表膨胀

> **Agent 开工前必读**：`docs/chapter-template/chapter-template.md`
> 本文件只提供本章节的具体决策与任务清单。

## 章节基本信息

| 字段 | 值 |
|---|---|
| 大纲来源 | `postgresql-study-outline.md` → 「三、高级阶段 → 2. VACUUM 与表膨胀」 |
| group | `advanced` |
| slug | `vacuum` |
| schema | `m_vacuum` |
| order | 2 |
| 读者画像 | 已会 MVCC（→ ch11）、索引（→ ch10） |

## 教学边界

- 覆盖：dead tuple、VACUUM / VACUUM FULL、autovacuum、FREEZE / wraparound、REINDEX
- 不展开：复制相关 VACUUM（→ ch22）、参数细致调优（→ ch21）

## 任务清单

### Task 1 — 写 `schema.ts`

`bloat_demo(id serial PK, payload text NOT NULL)` — 故意便于产生 dead tuple 的简单表。

### Task 2 — 写 `seed.sql`

`bloat_demo` 1 万行（每行 payload 用 `repeat('x', 200)` 让物理占用明显）。

### Task 3 — 写 Section 1：Dead Tuple 来自哪里

- **定义段要点**：UPDATE / DELETE 不就地修改 / 老版本变 dead tuple（→ ch11 MVCC） / 直到没有活跃事务能看到才能回收 / dead tuple 累计 = 表膨胀
- **语法骨架**：ASCII，UPDATE 前后行版本示意
- **mermaid**：加。画 UPDATE 后旧行 → dead tuple → VACUUM 回收的时间线
- **Examples**：
  - `inspect-dead-tuples-before` — `SELECT n_live_tup, n_dead_tup FROM pg_stat_user_tables WHERE relname = 'bloat_demo'`；`support: 'partial'`
  - `make-dead-tuples` — `UPDATE bloat_demo SET payload = payload WHERE id <= 5000`（产生 5000 个 dead tuple）+ 再查 pg_stat；`support: 'partial'`；`timeoutMs: 30000`

### Task 4 — 写 Section 2：VACUUM（普通）

- **定义段要点**：`VACUUM <table>` 标记 dead tuple 空间可重用，**不缩小文件** / 同时更新 visibility map 让 Index Only Scan 可用 / 不阻塞读写 / 后台 autovacuum 自动跑
- **语法骨架**：ASCII，`VACUUM [VERBOSE] [<table>]`
- **mermaid**：不加
- **Examples**：
  - `vacuum-basic` — `VACUUM bloat_demo` + 再看 pg_stat（n_dead_tup 降低）；`support: 'partial'`；`timeoutMs: 30000`
  - `vacuum-verbose` — `VACUUM VERBOSE bloat_demo`；`support: 'partial'`；`timeoutMs: 30000`

### Task 5 — 写 Section 3：VACUUM FULL 与磁盘回收

- **定义段要点**：`VACUUM FULL` 真正重写文件、释放磁盘 / 需要**写锁**整张表 / 生产慎用 / `pg_relation_size` 看物理大小变化 / 替代：`CLUSTER` 或 pg_repack（扩展）
- **语法骨架**：ASCII，`VACUUM FULL [<table>]`
- **mermaid**：不加
- **Examples**：
  - `relation-size-before-after-full` — `SELECT pg_size_pretty(pg_relation_size('bloat_demo'))` → DELETE 一半 → 再看 → `VACUUM bloat_demo`（不变） → `VACUUM FULL bloat_demo`（缩小） → 再看；`support: 'partial'`；`timeoutMs: 30000`

### Task 6 — 写 Section 4：Autovacuum

- **定义段要点**：后台进程根据阈值自动跑 VACUUM / 关键参数：`autovacuum_vacuum_threshold` / `..._scale_factor` / `..._cost_delay` / 表级 storage parameter 可覆盖全局 / 适合写多表调高频率
- **语法骨架**：ASCII，参数列表 + `ALTER TABLE ... SET (autovacuum_vacuum_scale_factor = ...)`
- **mermaid**：不加
- **Examples**：
  - `show-autovacuum-settings` — `SHOW autovacuum_vacuum_threshold; SHOW autovacuum_vacuum_scale_factor;`；`support: 'partial'`
  - `last-autovacuum-time` — `SELECT relname, last_autovacuum, last_vacuum FROM pg_stat_user_tables WHERE schemaname = 'm_vacuum'`；`support: 'partial'`
  - `set-table-autovacuum-aggressive` — `ALTER TABLE bloat_demo SET (autovacuum_vacuum_scale_factor = 0.05)` + 查 reloptions + 末尾 RESET；`support: 'partial'`

### Task 7 — 写 Section 5：FREEZE 与事务 ID wraparound

- **定义段要点**：每事务一个 32 位 xid，约 20 亿后会绕回 / VACUUM 把老行 freeze（标 frozen 后所有事务都视为可见，无需对比 xid） / `vacuum_freeze_min_age` / `autovacuum_freeze_max_age` 控制 / 长时间不 vacuum 的库可能因 wraparound 风险被 PG 强制只读
- **语法骨架**：ASCII，关键参数列表
- **mermaid**：加。画 xid 圆环 + freeze 把老行从环上移除示意
- **Examples**：
  - `show-freeze-params` — `SHOW vacuum_freeze_min_age; SHOW autovacuum_freeze_max_age;`；`support: 'partial'`
  - `inspect-relfrozenxid` — `SELECT relname, age(relfrozenxid) FROM pg_class WHERE relname = 'bloat_demo'`；`support: 'partial'`

### Task 8 — 写 Section 6：索引膨胀与 REINDEX

- **定义段要点**：UPDATE / DELETE 也会让索引膨胀 / `REINDEX [INDEX|TABLE] <name>` 重建 / `CONCURRENTLY` 选项可不阻塞写 / 看膨胀比例可用 pgstattuple 扩展（点到为止）
- **语法骨架**：ASCII，`REINDEX [CONCURRENTLY] {INDEX | TABLE} <name>`
- **mermaid**：不加
- **Examples**：
  - `reindex-table` — `REINDEX TABLE bloat_demo`；`support: 'partial'`；`timeoutMs: 30000`
  - `inspect-index-size` — `SELECT pg_size_pretty(pg_relation_size(indexrelid)) AS size, indexrelname FROM pg_stat_user_indexes WHERE schemaname = 'm_vacuum'`；`support: 'partial'`

### Task 9 — 写 `index.ts`

`examples` 数组约 12 个；含 VACUUM / 大写操作的 example 设 `timeoutMs: 30000`。

### Task 10 — 注册到 `registry.ts`

## 完成验收 Checklist

### 内容边界
- [ ] 6 个 Section 主语依次为：dead tuple、VACUUM、VACUUM FULL、autovacuum、FREEZE / wraparound、REINDEX
- [ ] pg_repack 仅点到为止，不展开
- [ ] Section 1、5 用 mermaid，label 无裸 `<` `>` `|`

### Schema / Seed
- [ ] bloat_demo 1 万行，payload 用 `repeat('x', 200)` 撑物理体积

### 重入安全
- [ ] `set-table-autovacuum-aggressive` 末尾 `ALTER TABLE ... RESET (autovacuum_vacuum_scale_factor)`
- [ ] `make-dead-tuples` 不依赖跨 example 状态（一次跑完独立）

### 关键 Example 行为
- [ ] `make-dead-tuples` 后 n_dead_tup > 0
- [ ] `vacuum-basic` 后 n_dead_tup 降低
- [ ] `relation-size-before-after-full` 中 VACUUM FULL 后文件显著缩小
