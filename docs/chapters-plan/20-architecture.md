# 章节生成任务：20. PostgreSQL 体系结构

> **Agent 开工前必读**：`docs/chapter-template/chapter-template.md`
> 本文件只提供本章节的具体决策与任务清单。

## 章节基本信息

| 字段 | 值 |
|---|---|
| 大纲来源 | `postgresql-study-outline.md` → 「三、高级阶段 → 4. PostgreSQL 体系结构」 |
| group | `advanced` |
| slug | `architecture` |
| schema | `m_architecture` |
| order | 4 |
| 读者画像 | 已会基本运维概念、看过 ch02 的体系一瞥 |

## 章节特殊性

本章重「概念 + 系统视图查询」，不重 DDL/DML。example 多为查系统视图。

## 教学边界

- 覆盖：进程模型、内存结构、存储布局、系统列、WAL 概念
- 不展开：复制（→ ch22）、配置调优（→ ch21）、备份（→ ch24）

## 任务清单

### Task 1 — 写 `schema.ts`

`probe(id serial PK, val text NOT NULL)` — 占位让 schema 非空。

### Task 2 — 写 `seed.sql`

`probe` 5 行。

### Task 3 — 写 Section 1：进程模型

- **定义段要点**：postmaster（主进程）负责监听、fork backend / 每个客户端连接对应一个 backend 进程 / 后台辅助进程：bgwriter、checkpointer、walwriter、autovacuum launcher / worker、stats collector / 进程模型（非线程）→ 连接代价高，需要连接池（→ ch21）
- **语法骨架**：ASCII，进程列表
- **mermaid**：加。画 postmaster + backend × N + 后台辅助进程的树状图
- **Examples**：
  - `list-backend-procs` — `SELECT pid, backend_type, application_name FROM pg_stat_activity ORDER BY backend_type`；`support: 'partial'`
  - `version-info` — `SELECT version()`；`support: 'partial'`

### Task 4 — 写 Section 2：内存结构

- **定义段要点**：共享内存 = shared_buffers（页缓存）+ wal_buffers + 其他 / 每 backend 私有：work_mem（排序/哈希）、maintenance_work_mem（VACUUM/CREATE INDEX）、temp_buffers / `effective_cache_size` 是 planner 的估计参数、不是实际分配
- **语法骨架**：ASCII，关键 GUC 列表
- **mermaid**：加。画一个 shared memory 框 + N 个 backend 各自的 work_mem 框
- **Examples**：
  - `show-memory-params` — `SHOW shared_buffers; SHOW work_mem; SHOW maintenance_work_mem; SHOW effective_cache_size;`；`support: 'partial'`

### Task 5 — 写 Section 3：存储布局

- **定义段要点**：每张表 = 一个或多个 8KB page 组成的物理文件 / 数据目录 `$PGDATA` 下按 oid 命名 / TOAST 表存大值 / `pg_relation_filepath()` 看文件路径 / FSM（free space map）和 VM（visibility map）伴生
- **语法骨架**：ASCII，文件路径 + 页结构示意
- **mermaid**：加。画一个 8KB page 内部结构（header / line pointers / tuples 倒序填）
- **Examples**：
  - `relation-filepath` — `SELECT pg_relation_filepath('probe')`；`support: 'partial'`
  - `table-toast-and-size` — `SELECT pg_size_pretty(pg_table_size('probe')), pg_size_pretty(pg_indexes_size('probe'))`；`support: 'partial'`

### Task 6 — 写 Section 4：系统列

- **定义段要点**：每张表自带 `oid`、`ctid`、`xmin`、`xmax`、`cmin`、`cmax`、`tableoid` / `ctid = (block, offset)` 指物理位置 / `xmin/xmax` 是 MVCC 关键（→ ch11） / 默认 SELECT 不包含
- **语法骨架**：ASCII，6 个系统列列表
- **mermaid**：不加
- **Examples**：
  - `inspect-system-columns` — `SELECT ctid, xmin, xmax, tableoid::regclass, id FROM probe LIMIT 3`；`support: 'partial'`

### Task 7 — 写 Section 5：WAL（写前日志）

- **定义段要点**：所有修改先写 WAL 再改数据 / 崩溃恢复重放 WAL / checkpoint 把脏页刷盘并标 WAL 可丢 / WAL 是流复制 / PITR 的基础（→ ch22 / ch24） / `pg_current_wal_lsn()` 看当前位置
- **语法骨架**：ASCII，写流程：内存 buffer → WAL → 数据文件
- **mermaid**：加。画 transaction → wal_buffer → walwriter 落盘 → checkpointer 刷脏页 三段流程
- **Examples**：
  - `wal-current-lsn` — `SELECT pg_current_wal_lsn(), pg_walfile_name(pg_current_wal_lsn())`；`support: 'partial'`
  - `wal-related-params` — `SHOW wal_level; SHOW max_wal_size; SHOW checkpoint_timeout;`；`support: 'partial'`

### Task 8 — 写 `index.ts`

`examples` 数组约 9 个。

### Task 9 — 注册到 `registry.ts`

## 完成验收 Checklist

### 内容边界
- [ ] 5 个 Section 主语依次为：进程模型、内存结构、存储布局、系统列、WAL
- [ ] 流复制 / PITR 只点到为止（→ ch22 / ch24）
- [ ] Section 1、2、3、5 用 mermaid，label 无裸 `<` `>` `|`

### 关键 Example 行为
- [ ] `list-backend-procs` 返回 ≥ 1 行
- [ ] `inspect-system-columns` 返回的 ctid 形如 `(0,1)`
- [ ] `wal-current-lsn` 返回非空 LSN
