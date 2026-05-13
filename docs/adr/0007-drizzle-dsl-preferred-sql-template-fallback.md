# ADR-0007: Example 执行函数优先用 drizzle DSL，drizzle 不支持的回落 `sql\`...\`` 模板

- **状态**: Accepted
- **日期**: 2026-05-12

## 背景

由 [[0005-dual-display-sql-and-drizzle]] 决定每个 Example 同时展示 SQL 和 drizzle 两份代码，**底层运行哪一份**仍需要决定。

drizzle-orm 提供两种执行方式：
- **DSL**：`db.select().from(users).where(...)` —— 类型安全、自动参数化、链式构建
- **`sql\`...\``** 模板字符串：`db.execute(sql\`SELECT ... FROM users\`)` —— 原样 SQL，绕过 DSL，但仍走 drizzle 的连接和事务

候选：

- **a. 全部用 drizzle DSL** —— 不支持的主题（DDL、窗口、LATERAL、JSONB、`pg_stat` 等）无法实现
- **b. 全部用 `sql\`...\`` 模板** —— 抛弃 DSL 的类型安全和参数化好处
- **c. drizzle DSL 优先，DSL 不能优雅表达的回落 sql 模板** —— 按 Example 个体决定

## 决策

选择 **c**：

- **默认尝试 drizzle DSL**——Example 标 `support: 'full'`
- 当 drizzle DSL **不直接支持** 或 **要绕大圈才能写** 时，回落到 `db.execute(sql\`...\`)`——Example 标 `support: 'partial'`，UI 加黄色徽章
- 当主题与 drizzle **完全无关**（VACUUM / EXPLAIN / pg_stat / WAL / 复制 / 备份 / psql 元命令）时，Example 标 `support: 'none'`，drizzle pane 替换为占位提示，"运行"按钮可用——后端仍用 `sql\`...\`` 执行

支持档位映射到执行：

| Support tier | drizzle pane 展示 | execute() 实现 |
|---|---|---|
| `full` | DSL 代码 | drizzle DSL |
| `partial` | `db.execute(sql\`...\`)` 混写 | `sql\`...\`` 模板 |
| `none` | 灰色提示"drizzle 不涉及" | `sql\`...\`` 模板 |

## 理由

- 类型安全和参数化对教学体验有价值（用户看到 drizzle 怎么映射到 SQL 是核心卖点）
- 但强行 DSL 化所有主题会牺牲覆盖面（25 模块至少一半涉及 drizzle 不直接支持的功能）
- "DSL 优先 + 模板兜底"既保留 DSL 体验，又能覆盖 100% 的 PG 教学主题

## 后果

- 每个 Example 文件里 `display.drizzle` 字符串和 `execute()` 函数必须一致——文字展示什么，底层就跑什么
- DDL Module 的所有 Example **默认是 `partial`**，因为 drizzle DSL 不支持 `CREATE TABLE` / `ALTER` / `DROP`
- 后续如果 drizzle 增加对某主题的原生支持，对应 Example 可以从 `partial` 升级到 `full`
- 后端单一执行路径：所有 Example 在事务里跑（`SET LOCAL search_path` + `statement_timeout`），DSL 和 sql 模板共用同一事务上下文

## 备选未选

- **a (全部 DSL)** 被否：覆盖不全
- **b (全部 sql 模板)** 被否：丢失 drizzle 的核心卖点
