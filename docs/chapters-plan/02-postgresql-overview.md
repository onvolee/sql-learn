# 章节生成任务：2. PostgreSQL 概述

> **Agent 开工前必读**：`docs/chapter-template/chapter-template.md`
> 本文件只提供本章节的具体决策与任务清单。

## 章节基本信息

| 字段 | 值 |
|---|---|
| 大纲来源 | `postgresql-study-outline.md` → 「一、入门阶段 → 2. PostgreSQL 概述」 |
| group | `basic` |
| slug | `postgresql-overview` |
| schema | `m_postgresql_overview` |
| order | 2 |
| 读者画像 | 零 SQL 基础，刚装完 PG，看过第 1 章 |

## 教学边界

- 只引入「PG 是什么 + 几个有体感的小 demo」，**点到为止**
- 「与 MySQL/Oracle 差异」「适用场景」放章节顶部 intro 段（每条 1-2 句），不单独成 Section
- 不深入：事务隔离级别（→ ch11）、MVCC 实现细节（→ ch11/ch20）、JSONB 操作符（→ ch13）、数组操作（→ ch16）

## 任务清单

### Task 1 — 写 `schema.ts`

一张通用表 `items` 撑后续 demo：
- `id serial PRIMARY KEY`
- `name text NOT NULL`
- `tags text[]`（演示「数组列」）
- `data jsonb`（演示「半结构化列」）

### Task 2 — 写 `seed.sql`

`items` 4 行，覆盖：有 tags 数组 / 有 data / tags 为空数组 / data 为 NULL 的各一行。显式 `id` + `ON CONFLICT (id) DO NOTHING`。

### Task 3 — 写 Section 1：PG 自报家门

- **定义段要点**：PG 是开源对象关系型数据库 / ACID 4 个字母一句话总览 / MVCC 用「多版本并发」一句话 / 本节让 PG 自己说话
- **语法骨架**：ASCII，`SELECT version()` 和 `SHOW <param>` 两组形态
- **mermaid**：不加
- **Examples**：
  - `show-version` — `SELECT version()`；`support: 'partial'`
  - `show-encoding` — `SHOW server_encoding`；`support: 'partial'`
  - `show-timezone` — `SHOW TimeZone`；`support: 'partial'`

### Task 4 — 写 Section 2：事务原子性的体感

- **定义段要点**：ACID 的「A」=Atomicity / 一个事务要么全提交要么全回滚 / SAVEPOINT 可以局部撤销 / 本节用 SAVEPOINT 演示「局部回滚」
- **语法骨架**：ASCII，`SAVEPOINT <name>` + `ROLLBACK TO <name>` 两段
- **mermaid**：不加
- **Examples**：
  - `tx-savepoint-demo` — 插入一行 → SAVEPOINT → 再插入一行 → `ROLLBACK TO` → 最终结果只看到第一行（用一个 `db.execute(sql\`...\`)` 把整段 SQL 包起来跑；`support: 'partial'`）

注：框架 `/exec` 本身已在事务里跑，演示 `BEGIN/COMMIT` 多余；用 SAVEPOINT 是单事务内可演示的最小子集。

### Task 5 — 写 Section 3：MVCC 一瞥

- **定义段要点**：每行物理上带 `xmin/xmax` 系统列 / `xmin` = 创建该版本的事务 id / 更新会产生新版本，老版本暂留 / 本节只「看到证据」，机制详在 ch11/ch20
- **语法骨架**：ASCII，`SELECT xmin, xmax, ctid, ... FROM <table>` 形态
- **mermaid**：不加
- **Examples**：
  - `inspect-xmin` — `SELECT xmin, xmax, ctid, id, name FROM items LIMIT 3`；`support: 'partial'`

### Task 6 — 写 Section 4：对象关系：非标量列

- **定义段要点**：PG 不只是「表 + 关系」 / 单元格可以是数组、JSONB、自定义类型 / 这是「对象」一词的来源 / 详在 ch05/ch13/ch16
- **语法骨架**：ASCII，`CREATE TABLE` 含 `text[]` 和 `jsonb` 列示意
- **mermaid**：不加
- **Examples**：
  - `array-column` — drizzle DSL，`db.select().from(items).where(...)` 配合数组非空过滤；`support: 'partial'`（drizzle DSL 数组函数支持有限）
  - `jsonb-column` — drizzle DSL，列出 data 非 NULL 的行；`support: 'full'`

### Task 7 — 写 `index.ts`

按模板 `ModuleDef` 结构。`examples` 数组顺序 = `index.md` 出现顺序（共 7 个）。

### Task 8 — 注册到 `registry.ts`

在 `apps/api/src/curriculum/registry.ts` 的 `all[]` 加入本 module。

## 完成验收 Checklist

### 内容边界
- [ ] 顶部 intro 段含「与 MySQL/Oracle 差异」「适用场景」简短对比（每条 1-2 句）
- [ ] 未深入讲事务隔离 / MVCC 实现 / JSONB 操作符 / 数组高级用法
- [ ] 4 个 Section 主语依次为：PG 自报家门、事务原子性的体感、MVCC 一瞥、对象关系：非标量列

### Schema / Seed
- [ ] `items` 表含 `text[]` 和 `jsonb` 列
- [ ] seed 至少一行有 tags、一行有 data、一行 tags 为空数组、一行 data 为 NULL

### 关键 Example 行为
- [ ] `show-version` 返回含 `PostgreSQL` 字样的字符串
- [ ] `tx-savepoint-demo` 最终只返回 SAVEPOINT 之前插入的那一行
- [ ] `inspect-xmin` 返回的 xmin 是非零整数
