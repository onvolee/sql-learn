# 章节生成任务：11. 事务与并发

> **Agent 开工前必读**：`docs/chapter-template/chapter-template.md`
> 本文件只提供本章节的具体决策与任务清单。

## 章节基本信息

| 字段 | 值 |
|---|---|
| 大纲来源 | `postgresql-study-outline.md` → 「二、中级阶段 → 3. 事务与并发」 |
| group | `intermediate` |
| slug | `transaction` |
| schema | `m_transaction` |
| order | 3 |
| 读者画像 | 写过百行 SQL，懂主外键，看过 ch02 的事务一瞥 |

## 章节特殊性

框架 `/exec` 每个 example 自带一个事务跑完即提交。**「两个事务」的演示在单连接 example 内做不了**。本章策略：
- 单事务内能演示的：SAVEPOINT、隔离级别声明、`SELECT ... FOR UPDATE`、advisory lock、xmin / xmax
- 「两个事务才看得见的现象」（脏读 / 不可重复读 / 幻读）**只在「定义段 + 文字示意」里讲**，不强求 example

## 教学边界

- 覆盖：ACID 简述、事务控制、隔离级别、MVCC、锁、死锁
- 不展开：分布式事务、两阶段提交、复制层事务（→ ch22）

## 任务清单

### Task 1 — 写 `schema.ts`

经典转账例：
- `accounts(id serial PK, owner text NOT NULL, balance numeric(10, 2) NOT NULL DEFAULT 0 CHECK (balance >= 0))`

### Task 2 — 写 `seed.sql`

`accounts` 4 行：Alice 1000 / Bob 1000 / Carol 100 / Dave 0。`ON CONFLICT DO NOTHING`。

### Task 3 — 写 Section 1：ACID 简述

- **定义段要点**：Atomicity 全或全无 / Consistency 不破约束 / Isolation 并发互不干扰 / Durability 提交后永久 / 本章重点在 I（并发 + 隔离）
- **语法骨架**：ASCII，列出 4 个字母及一句话定义
- **mermaid**：不加
- **Examples**：
  - `acid-atomicity-demo` — 用 SAVEPOINT + ROLLBACK TO 演示「中间步骤撤销，最终结果一致」；`support: 'partial'`

### Task 4 — 写 Section 2：事务控制 — BEGIN / COMMIT / ROLLBACK / SAVEPOINT

- **定义段要点**：`BEGIN`（或 `START TRANSACTION`）开启 / `COMMIT` 提交 / `ROLLBACK` 全部撤销 / `SAVEPOINT <name>` 设保存点、`ROLLBACK TO <name>` 局部撤销 / 本课程框架已为你包了一层事务，example 里通常只演示 SAVEPOINT
- **语法骨架**：ASCII，5 个语句各一行
- **mermaid**：加。画事务生命周期状态图：`Idle → InTransaction → (Commit / Rollback) → Idle`
- **Examples**：
  - `savepoint-rollback-to` — SAVEPOINT + 多步操作 + ROLLBACK TO 中间某点；`support: 'partial'`
  - `savepoint-release` — `RELEASE SAVEPOINT` 把保存点丢弃但保留改动；`support: 'partial'`

### Task 5 — 写 Section 3：隔离级别

- **定义段要点**：4 个 SQL 标准级别 / PG 实际只实现 3 个：Read Committed（默认） / Repeatable Read / Serializable / 高级别防更多并发异常但代价更大 / **要演示「跨事务异常」需 2 个连接，本课程只能展示「如何声明」**
- **语法骨架**：ASCII，`SET TRANSACTION ISOLATION LEVEL <level>` + 对照表（哪些异常被防）
- **mermaid**：加。画隔离级别 × 异常（脏读 / 不可重复读 / 幻读 / 序列化异常）的网格状态图
- **Examples**：
  - `show-default-isolation` — `SHOW default_transaction_isolation`；`support: 'partial'`
  - `set-isolation-repeatable-read` — 在当前事务里 `SET TRANSACTION ISOLATION LEVEL REPEATABLE READ` + 查 `current_setting('transaction_isolation')`；`support: 'partial'`

### Task 6 — 写 Section 4：MVCC 原理

- **定义段要点**：每行物理上多版本共存 / `xmin` 创建事务、`xmax` 删除事务 / 每个事务有自己的「快照」决定能看到哪些版本 / UPDATE = 标老版本删除 + 写新版本 / 老版本由 VACUUM 回收（→ ch18）
- **语法骨架**：ASCII，`SELECT xmin, xmax, ctid, ... FROM <table>` + 更新后这三个系统列变化示意
- **mermaid**：加。画一行被 UPDATE 后产生「旧版本（xmax=t1）」「新版本（xmin=t1）」的并存示意
- **Examples**：
  - `mvcc-inspect-xmin` — 看初始 xmin/xmax/ctid；`support: 'partial'`
  - `mvcc-update-creates-new-version` — 一行的 UPDATE 后 ctid 变化（被搬到新位置）；`support: 'partial'`

### Task 7 — 写 Section 5：锁 — 行锁 / 表锁 / 咨询锁

- **定义段要点**：行锁 `SELECT ... FOR UPDATE` 锁单行直到事务结束 / 表锁 `LOCK TABLE` 各种模式 / 咨询锁 `pg_advisory_lock(id)` 用户自定义场景 / PG 自动加锁的场景由 DML 决定
- **语法骨架**：ASCII，三类锁各一条
- **mermaid**：不加
- **Examples**：
  - `row-lock-for-update` — `SELECT ... FROM accounts WHERE id = 1 FOR UPDATE`（本事务内独占）；`support: 'partial'`
  - `advisory-lock-acquire-release` — `SELECT pg_advisory_lock(42)` + 做事 + `SELECT pg_advisory_unlock(42)`；`support: 'partial'`
  - `inspect-pg-locks` — 查 `pg_locks` 看本事务持有的锁；`support: 'partial'`

### Task 8 — 写 Section 6：死锁

- **定义段要点**：两个事务互相等对方持有的锁 / PG 自动检测死锁并杀掉其中一个（40P01） / 业务上**按固定顺序加锁**避免死锁 / **本节只解释，不演示**（需 2 个连接）
- **语法骨架**：ASCII，「事务 A 锁 1 等 2 / 事务 B 锁 2 等 1」文字示意
- **mermaid**：加。画两事务循环等待的环图
- **Examples**：
  - `deadlock-timeout-setting` — `SHOW deadlock_timeout`；`support: 'partial'`（仅看配置，不真死锁）

### Task 9 — 写 `index.ts`

`examples` 数组约 12 个。

### Task 10 — 注册到 `registry.ts`

## 完成验收 Checklist

### 内容边界
- [ ] 6 个 Section 主语依次为：ACID、事务控制、隔离级别、MVCC、锁、死锁
- [ ] Section 5 mermaid 在事务生命周期状态机（顶部说明）
- [ ] Section 6 mermaid 画环式等待（label 无裸 `<` `>` `|`）
- [ ] 顶部 intro 段明确说明「跨事务异常的演示在课程框架内做不了，本章只演示单事务可见的部分」

### 关键 Example 行为
- [ ] `mvcc-update-creates-new-version` 跑后同一行的 ctid 改变
- [ ] `set-isolation-repeatable-read` 在本事务内 transaction_isolation 设为 repeatable read
- [ ] `advisory-lock-acquire-release` 成功获取与释放（返回 true）
- [ ] `inspect-pg-locks` 至少返回本会话的锁信息

### 重入安全
- [ ] `row-lock-for-update` 末尾不留下「未提交事务」（框架已自动提交）
- [ ] `advisory-lock-acquire-release` 务必在同 example 内 unlock，否则该锁会被会话持有
- [ ] `acid-atomicity-demo` 用 SAVEPOINT + ROLLBACK TO 保证主表数据不变
