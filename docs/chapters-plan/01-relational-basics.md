# 章节生成任务：1. 关系型数据库基础概念

> **Agent 开工前必读**：`docs/chapter-template/chapter-template.md`
> 模板里已覆盖：文件结构、Section 4 个必填元素（定义段 / 语法骨架 / 可选 mermaid / Examples）、命名约束、mermaid 三个坑、ExampleDef 三档样板、`/exec` 与 `/reset` 语义下的重入安全规则。
> **本文件只提供本章节的具体决策与任务清单**，凡是模板里已写的通用规则不再重复。

## 章节基本信息

| 字段 | 值 |
|---|---|
| 大纲来源 | `postgresql-study-outline.md` → 「一、入门阶段 → 1. 关系型数据库基础概念」 |
| group | `basic` |
| slug | `relational-basics` |
| schema | `m_relational_basics`（slug 派生） |
| order | 1 |
| 读者画像 | 零 SQL 基础（参见模板「章节分组与读者画像」表的 `basic` 行） |

## 教学边界

**本章只引入概念名词 + 一两句话定义 + 看得见的 demo。**

不讲：MVCC、事务隔离、EXPLAIN、JSONB、查询优化、连接池、复制、索引类型选型、约束完整种类（CHECK / DEFAULT 等）。这些归后续章节。

## 任务清单

### Task 1 — 写 `schema.ts`

用 `pgSchema('m_relational_basics')` 建两张关联表：

| 表 | 列 | 约束 |
|---|---|---|
| `authors` | `id serial`、`name text NOT NULL`、`country text` | `id` PK |
| `books` | `id serial`、`title text NOT NULL`、`author_id int NOT NULL`、`published_year int` | `id` PK；`author_id` REFERENCES `authors(id)` |

**不预建** `title` 索引（Section 3 的 example 会建）。

### Task 2 — 写 `seed.sql`

- `authors`：4 行，4 个不同 `country`
- `books`：8 行，覆盖 4 个 author（每人 1-3 本），至少一行 `published_year IS NULL`
- 全部用显式 `id` + `ON CONFLICT (id) DO NOTHING`（保证 `/reset` 后重跑幂等）

### Task 3 — 写 Section 1：表、行、列

- **定义段要点**：表是二维数据集合 / 行 = 一条记录 / 列 = 字段（名字 + 类型）/ 一张表所有行的列结构一致 / 表归属于 schema（第 4 节展开）
- **语法骨架**：ASCII，`CREATE TABLE` 模板
- **mermaid**：不加
- **Examples**：
  - `inspect-table-shape` — 用 drizzle DSL `db.select().from(books).orderBy(books.id)` 看全表（display SQL 用 `SELECT * FROM books ORDER BY id`）；`support: 'full'`
  - `inspect-columns` — 查 `information_schema.columns` 看 books 的列名 + 类型；`support: 'partial'`
  - `count-rows` — `count(*)`；`support: 'full'`

### Task 4 — 写 Section 2：主键、外键

- **定义段要点**：主键唯一标识一行（不重复、不为 NULL）/ 外键是指向另一张表主键的「指针」/ PG 保证外键值在被引用表里存在 / 两者组合表达「实体 + 关系」
- **语法骨架**：ASCII，`CREATE TABLE` 含 `PRIMARY KEY` 和 `REFERENCES` 子句的模板（**本节模板必须有 ASCII 骨架，不能只画 mermaid**）
- **mermaid**：加，画 `books.author_id → authors.id` 关系图。label 用 `<br/>` 换行，禁用裸 `<` `>` `|`
- **Examples**（4 个）：
  - `pk-violation` — 插入已存在的 `id=1`，期望失败（SQLSTATE 23505）；用 drizzle DSL `db.insert(authors).values({...})`；`support: 'full'`
  - `fk-insert-ok` — 插入 `author_id=1` 的合法 book（用 `id=9` + `ON CONFLICT DO NOTHING` 保证可重入）；drizzle DSL；`support: 'full'`
  - `fk-violation` — 插入 `author_id=999` 不存在的 author，期望失败（SQLSTATE 23503）；drizzle DSL；`support: 'full'`
  - `inspect-constraints` — 查 `pg_constraint`（`WHERE connamespace = current_schema()::regnamespace`）看 `p` / `f` 类型；`support: 'partial'`

### Task 5 — 写 Section 3：索引

- **定义段要点**：索引是建在表上的独立查找结构 / 主键自动带索引 / 其他列要查得快就显式建 / 索引不改数据只加快定位 / **类型选型在第 10 章不讲**
- **语法骨架**：ASCII，`CREATE INDEX <name> ON <table> (<col>)`
- **mermaid**：不加（索引内部结构不在本章范围）
- **Examples**：
  - `inspect-default-index` — 查 `pg_indexes` 看主键自带的索引；`support: 'partial'`
  - `create-index-on-title` — `CREATE INDEX IF NOT EXISTS books_title_idx ON books (title)` + 跟一个 `pg_indexes` 查询验证；`support: 'partial'`
  - `index-is-separate-object` — `DROP INDEX IF EXISTS books_title_idx` + `SELECT count(*) FROM books` 证明数据还在；`support: 'partial'`

**重入要求**：这两个 example 必须任意顺序、任意次数运行都不报错（用 `IF NOT EXISTS` / `IF EXISTS`）。

### Task 6 — 写 Section 4：Schema（命名空间）

- **定义段要点**：一个库里可有多个 schema / schema 是命名空间 / `a.users` 和 `b.users` 是两张完全不同的表 / `search_path` 决定不带前缀写 `users` 时去哪找 / 本课程每个 module 隔离在 `m_<slug>` 里
- **语法骨架**：ASCII，`CREATE SCHEMA` + `SET search_path` + 跨 schema 引用三段
- **mermaid**：不加
- **Examples**：
  - `list-schemas` — `information_schema.schemata WHERE schema_name LIKE 'm_%'`；`support: 'partial'`
  - `current-schema-of-this-module` — `SELECT current_schema()`，期望返回 `m_relational_basics`；`support: 'partial'`
  - `qualified-vs-unqualified` — `UNION ALL` 同时跑 `FROM books` 和 `FROM m_relational_basics.books`，证明默认 search_path 已指向本 schema；`support: 'partial'`

### Task 7 — 写 `index.ts`

按模板「模板文件夹结构」节的 `ModuleDef` 字段。`examples` 数组的顺序 = `index.md` 里 example 出现的顺序（Section 1 三个 → Section 2 四个 → Section 3 三个 → Section 4 三个，共 13 个）。

### Task 8 — 注册到 `registry.ts`

在 `apps/api/src/curriculum/registry.ts` 的 `all[]` 数组里 import 并加入本 module。

## 完成验收 Checklist

> 模板 Checklist（文件齐全 / id 三处一致 / `support` 判定 / 写操作可重入 / mermaid label 无裸字符 / 已注册 / `pnpm dev` 跑通）默认全过；下面只列**本章特定**的验收点。

### 内容边界
- [ ] 章节正文未出现：MVCC、事务隔离、EXPLAIN、JSONB、连接池、复制、索引类型对比、CHECK / DEFAULT 详解
- [ ] 未出现「易错点」「常见错误」「建议」「注意」类小节
- [ ] 未出现「前面讲过 X，现在我们…」式跨模块回顾

### Section 完整性
- [ ] 4 个 Section 主语依次为：表/行/列、主键 外键、索引、Schema
- [ ] **Section 2 同时含 ASCII 语法骨架 + mermaid 关系图**（不能只画 mermaid 跳过骨架）
- [ ] 13 个 example id 完全覆盖（无遗漏、无多余）

### Schema / Seed
- [ ] `authors` 4 行 / `books` 8 行
- [ ] `books` 至少一行 `published_year IS NULL`
- [ ] seed 用显式 `id` + `ON CONFLICT (id) DO NOTHING`

### 关键 Example 行为
- [ ] `pk-violation` 跑一次返回 SQLSTATE 23505
- [ ] `fk-violation` 跑一次返回 SQLSTATE 23503
- [ ] `fk-insert-ok` 连跑两次第二次返回空（`ON CONFLICT DO NOTHING` 命中）
- [ ] `create-index-on-title` + `index-is-separate-object` 任意顺序连跑均成功
- [ ] `current-schema-of-this-module` 返回 `m_relational_basics`
