# 章节生成任务：24. 备份与恢复

> **Agent 开工前必读**：`docs/chapter-template/chapter-template.md`
> 本文件只提供本章节的具体决策与任务清单。

## 章节基本信息

| 字段 | 值 |
|---|---|
| 大纲来源 | `postgresql-study-outline.md` → 「三、高级阶段 → 8. 备份与恢复」 |
| group | `advanced` |
| slug | `backup-restore` |
| schema | `m_backup_restore` |
| order | 8 |
| 读者画像 | 已会 WAL（→ ch20）、复制（→ ch22） |

## 章节特殊性

`pg_dump` / `pg_basebackup` / `pg_restore` 都是**操作系统命令行工具**，不在 SQL 里跑。本章策略：
- 所有命令行工具用语法骨架 + 文字解释展示
- example 只跑 SQL 层能跑的：`COPY ... TO/FROM`、查 WAL 归档相关 GUC、`pg_export_snapshot`

## 教学边界

- 覆盖：逻辑备份（pg_dump / COPY）、物理备份（pg_basebackup）、WAL 归档与 PITR、恢复流程概念
- 不展开：第三方备份工具（pgBackRest / Barman 仅点到为止）、备份策略 / RPO RTO 设计

## 任务清单

### Task 1 — 写 `schema.ts`

`orders(id serial PK, customer text NOT NULL, amount numeric(10,2) NOT NULL)`

### Task 2 — 写 `seed.sql`

`orders` 100 行。

### Task 3 — 写 Section 1：逻辑备份 — pg_dump / pg_restore / COPY

- **定义段要点**：`pg_dump` 把数据库 dump 成 SQL 或自定义格式 / 适合迁移、小库备份 / 跨大版本能用 / `COPY ... TO STDOUT` / `COPY ... FROM STDIN` 是 SQL 层的批量导入导出
- **语法骨架**：ASCII，`pg_dump -Fc -d <db> -f <out>` + `pg_restore -d <db> <file>` + `COPY <tbl> TO/FROM ...` 三条
- **mermaid**：不加
- **Examples**：
  - `copy-to-stdout` — `COPY (SELECT * FROM orders LIMIT 5) TO STDOUT WITH (FORMAT csv)`（教学环境返回结果集，模拟导出）；`support: 'partial'`
  - `copy-format-comparison` — `COPY (SELECT * FROM orders LIMIT 3) TO STDOUT WITH (FORMAT csv, HEADER true)`；`support: 'partial'`

### Task 4 — 写 Section 2：物理备份 — pg_basebackup

- **定义段要点**：复制 `$PGDATA` 整个目录 + WAL / 输出是「另一个可启动 PG 实例」 / 比 pg_dump 快、能配合 WAL 做 PITR / 不能跨大版本 / 通常给搭备库或 PITR 基线用
- **语法骨架**：ASCII，`pg_basebackup -h <host> -D <dir> -Ft -X stream -P`
- **mermaid**：加。画 pg_basebackup 复制 $PGDATA + WAL stream 的两条数据流
- **Examples**：
  - `pgdata-location` — `SHOW data_directory`；`support: 'partial'`

### Task 5 — 写 Section 3：WAL 归档与 PITR

- **定义段要点**：`archive_mode = on` + `archive_command` 把 WAL 段归档到远程 / 备份基线 + 归档 WAL 可恢复到任意时间点（PITR） / 恢复时建 `recovery.signal` 文件 + 设 `recovery_target_time` / PG 12+ 用 postgresql.conf 替代 recovery.conf
- **语法骨架**：ASCII，`archive_mode / archive_command / restore_command / recovery_target_time` 4 个 GUC
- **mermaid**：加。画时间轴：base backup → WAL segments archive → restore to point-in-time
- **Examples**：
  - `show-archive-params` — `SHOW archive_mode; SHOW archive_command;`；`support: 'partial'`
  - `current-wal-position` — `SELECT pg_current_wal_lsn(), pg_walfile_name(pg_current_wal_lsn())`；`support: 'partial'`

### Task 6 — 写 Section 4：快照与一致性导出

- **定义段要点**：`pg_export_snapshot()` 导出当前事务快照 ID / 另一连接 `SET TRANSACTION SNAPSHOT <id>` 拿到相同视图 / pg_dump 用这机制保证多对象一致 / 对教学环境单事务可演示快照创建
- **语法骨架**：ASCII，`pg_export_snapshot` + `SET TRANSACTION SNAPSHOT`
- **mermaid**：不加
- **Examples**：
  - `export-snapshot` — `SELECT pg_export_snapshot()`（在当前事务内输出 snapshot id）；`support: 'partial'`

### Task 7 — 写 Section 5：第三方备份工具（点到为止）

- **定义段要点**：pgBackRest / Barman 是社区主流 / 支持增量备份、并行、远端存储 / 适合大库 / 本课程不展开
- **语法骨架**：ASCII，工具列表 + 一句 each
- **mermaid**：不加
- **Examples**：
  - `available-extensions-note` — `SELECT 'pgBackRest / Barman 在 OS 层运行，不是 PG 扩展' AS note`；`support: 'partial'`

### Task 8 — 写 `index.ts`

`examples` 数组约 8 个。

### Task 9 — 注册到 `registry.ts`

## 完成验收 Checklist

### 内容边界
- [ ] 5 个 Section 主语依次为：逻辑备份、物理备份、WAL 归档与 PITR、快照、第三方工具
- [ ] 顶部 intro 段说明「pg_dump / pg_basebackup / pg_restore 是 OS 命令，本课程只在 SQL 层演示 COPY 与归档相关查询」
- [ ] Section 2、3 用 mermaid，label 无裸 `<` `>` `|`

### 关键 Example 行为
- [ ] `copy-to-stdout` 返回 5 行
- [ ] `pgdata-location` 返回非空路径
- [ ] `export-snapshot` 返回类似 `00000003-...` 的 snapshot id
