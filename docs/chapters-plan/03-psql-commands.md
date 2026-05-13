# 章节生成任务：3. psql 命令

> **Agent 开工前必读**：`docs/chapter-template/chapter-template.md`
> 本文件只提供本章节的具体决策与任务清单。

## 章节基本信息

| 字段 | 值 |
|---|---|
| 大纲来源 | `postgresql-study-outline.md` → 「一、入门阶段 → 3. psql 命令」 |
| group | `basic` |
| slug | `psql-commands` |
| schema | `m_psql_commands` |
| order | 3 |
| 读者画像 | 零 SQL 基础，本地装了 PG（可能装了 psql 也可能没装） |

## 章节特殊性

psql 是**客户端工具**，本课程是 web 跑 SQL，**无法真正运行元命令**。本章策略：
- 每个元命令 → 给出**等价的 pg_catalog / information_schema 查询**
- 章节顶部 intro 段解释「psql 是什么 + 元命令是 pg_catalog 的快捷查询」
- 输出控制类（`\timing` / `\x` / `\e` / `\i`）只在文末「客户端元命令快速参考」表里列出（纯 prose），不做 Example

## 教学边界

- 不教 psql 安装 / 连接参数（属环境配置，不属课程）
- 不教 `\copy` 之类的导入导出（→ ch24 备份）
- 不教 `\watch` 之类的 advanced（点到为止）

## 任务清单

### Task 1 — 写 `schema.ts`

一张 `books` 表 + 一个示例函数（在 seed 里建），方便演示 `\dt` / `\df` 的等价查询：
- `books(id serial PK, title text NOT NULL, author text)`

### Task 2 — 写 `seed.sql`

- `books` 3 行
- `CREATE OR REPLACE FUNCTION title_upper(b books) RETURNS text AS $$ SELECT upper(b.title) $$ LANGUAGE SQL;`（用 `CREATE OR REPLACE` 保证重入幂等）

### Task 3 — 写 Section 1：元命令的本质

- **定义段要点**：psql 是 PG 的命令行客户端 / `\` 开头的是元命令 / 元命令大多是 pg_catalog / information_schema 查询的快捷方式 / 本节让你看到「等价 SQL」
- **语法骨架**：ASCII，并列对比 `\<cmd>` 和「等价 SQL」两栏
- **mermaid**：不加
- **Examples**：
  - `equiv-of-conninfo` — `\conninfo` 等价 `SELECT current_database(), current_user, inet_server_addr(), inet_server_port()`；`support: 'partial'`

### Task 4 — 写 Section 2：列对象（数据库 / 表 / 列 / 索引）

- **定义段要点**：列对象类元命令最常用 / 都映射到 pg_catalog / information_schema / 本节列 `\l`、`\dt`、`\d <table>`、`\di` 的等价查询
- **语法骨架**：ASCII，列 4 个元命令与对应等价 SELECT
- **mermaid**：不加
- **Examples**：
  - `equiv-of-l` — `\l` 等价 `SELECT datname FROM pg_database ORDER BY datname`；`support: 'partial'`
  - `equiv-of-dt` — `\dt` 等价 `SELECT tablename FROM pg_tables WHERE schemaname = current_schema()`；`support: 'partial'`
  - `equiv-of-d-table` — `\d books` 等价 `SELECT column_name, data_type, is_nullable FROM information_schema.columns WHERE table_schema = current_schema() AND table_name = 'books' ORDER BY ordinal_position`；`support: 'partial'`
  - `equiv-of-di` — `\di` 等价 `SELECT indexname, indexdef FROM pg_indexes WHERE schemaname = current_schema()`；`support: 'partial'`

### Task 5 — 写 Section 3：列函数与角色

- **定义段要点**：`\df` 列函数 / `\du` 列角色（权限详在 ch15） / 本节同样给等价 SQL
- **语法骨架**：ASCII，列 2 个元命令与对应等价 SELECT
- **mermaid**：不加
- **Examples**：
  - `equiv-of-df` — `\df` 等价 `SELECT proname, pg_get_function_result(oid), pg_get_function_arguments(oid) FROM pg_proc WHERE pronamespace = current_schema()::regnamespace`；`support: 'partial'`
  - `equiv-of-du` — `\du` 等价 `SELECT rolname, rolsuper, rolcreatedb, rolcanlogin FROM pg_roles ORDER BY rolname`；`support: 'partial'`

### Task 6 — 写文末「客户端元命令快速参考」表

**这是 Section 之外**的一个纯 prose 小节，标题用 `## 附：客户端元命令快速参考`，含一个 markdown 表格列出：`\timing` / `\x` / `\e` / `\i <file>` / `\?` 各自一句话用途。**不含 Example**（这些纯客户端行为，无对应 SQL）。

### Task 7 — 写 `index.ts`

`examples` 数组 7 个，按 index.md 出现顺序。

### Task 8 — 注册到 `registry.ts`

## 完成验收 Checklist

### 内容边界
- [ ] 顶部 intro 段说明「本课程在 web 跑 SQL，无法运行元命令；本章给等价 SQL」
- [ ] 文末「客户端元命令快速参考」用 markdown 表格列出 ≥4 个输出控制元命令
- [ ] 3 个 Section 主语依次为：元命令的本质、列对象、列函数与角色
- [ ] 未出现「易错点」「建议」类小节

### Schema / Seed
- [ ] `books` 3 行
- [ ] seed 用 `CREATE OR REPLACE FUNCTION` 建一个示例函数，保证重入幂等

### 关键 Example 行为
- [ ] `equiv-of-dt` 返回结果中含 `books`
- [ ] `equiv-of-df` 返回结果中含 `title_upper`
- [ ] `equiv-of-du` 至少返回当前数据库用户一行
