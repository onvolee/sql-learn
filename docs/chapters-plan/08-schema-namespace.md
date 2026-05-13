# 章节生成任务：8. Schema 与命名空间

> **Agent 开工前必读**：`docs/chapter-template/chapter-template.md`
> 本文件只提供本章节的具体决策与任务清单。

## 章节基本信息

| 字段 | 值 |
|---|---|
| 大纲来源 | `postgresql-study-outline.md` → 「一、入门阶段 → 8. Schema 与命名空间」 |
| group | `basic` |
| slug | `schema-namespace` |
| schema | `m_schema_namespace` |
| order | 8 |
| 读者画像 | 零 SQL 基础，已看过 ch01 Section 4 的 schema 入门 |

## 教学边界

- 本章是 ch01 Section 4 的展开：CREATE / DROP SCHEMA、`search_path` 配置、跨 schema 引用
- 不展开：schema 级权限（→ ch15）、`pg_temp` 临时 schema（点到为止不深入）、扩展安装到指定 schema

## 任务清单

### Task 1 — 写 `schema.ts`

主 schema 一张 `t1` 表演示「同名表在不同 schema 里互不冲突」：
- `t1(id serial PK, val text NOT NULL)`

example 会用 `CREATE SCHEMA tmp_other` 临时建另一个 schema 演示。

### Task 2 — 写 `seed.sql`

`t1` 3 行，全部 `ON CONFLICT DO NOTHING`。

### Task 3 — 写 Section 1：创建与删除 schema

- **定义段要点**：`CREATE SCHEMA <name>` 建 / `DROP SCHEMA <name> [CASCADE]` 删 / CASCADE 连带删 schema 内所有对象 / schema 是表 / 视图 / 函数 / 序列 / 类型的命名空间
- **语法骨架**：ASCII，`CREATE SCHEMA <name>` + `DROP SCHEMA <name> [CASCADE]`
- **mermaid**：不加
- **Examples**：
  - `create-tmp-schema` — `CREATE SCHEMA IF NOT EXISTS tmp_other` + `SELECT schema_name FROM information_schema.schemata WHERE schema_name = 'tmp_other'`；`support: 'partial'`
  - `drop-tmp-schema-cascade` — 先在 `tmp_other` 里建一张表，再 `DROP SCHEMA tmp_other CASCADE`，验证表也消失；`support: 'partial'`（用 `DROP SCHEMA IF EXISTS` 保证重入）

### Task 4 — 写 Section 2：search_path 与未限定引用

- **定义段要点**：写 `SELECT FROM t1` 不带 schema 前缀时，PG 按 `search_path` 顺序查找 / 默认 `search_path = "$user", public` / `SET LOCAL search_path TO <schema>` 改当前事务的查找路径 / 本课程 `/exec` 已为你 `SET LOCAL search_path TO m_<slug>, pg_catalog`
- **语法骨架**：ASCII，`SHOW search_path` + `SET LOCAL search_path TO <a>, <b>`
- **mermaid**：不加
- **Examples**：
  - `show-current-search-path` — `SHOW search_path`；`support: 'partial'`
  - `change-search-path-effect` — 一段 SQL：先 `SHOW search_path` → 然后 `CREATE SCHEMA IF NOT EXISTS tmp_other` + 在里面建 `CREATE TABLE IF NOT EXISTS tmp_other.t1(id int)` + `INSERT (1)` → `SET LOCAL search_path TO tmp_other` → `SELECT * FROM t1`（这时拿到的是 tmp_other.t1 的数据，不是主 schema 的）；末尾 `DROP SCHEMA tmp_other CASCADE`；`support: 'partial'`

### Task 5 — 写 Section 3：跨 schema 引用与同名冲突

- **定义段要点**：完整限定 `<schema>.<table>` 总是明确无歧义 / 不同 schema 可有同名表 / 函数 / search_path 中第一个命中的 schema 决定不限定名解析
- **语法骨架**：ASCII，`<schema>.<table>` 形式 + 一段示意「两个 schema 同名 t1 各 select 一次」
- **mermaid**：加。画两个并列的 schema box（`m_schema_namespace.t1` 和 `tmp_other.t1`）+ search_path 箭头指向其中之一
- **Examples**：
  - `qualified-name-cross-schema` — 一个 example：`CREATE SCHEMA IF NOT EXISTS tmp_other` + 同名 t1 表 + 各插一行不同 val + `SELECT 'main' AS src, val FROM m_schema_namespace.t1 UNION ALL SELECT 'other', val FROM tmp_other.t1`；末尾 DROP CASCADE；`support: 'partial'`
  - `list-tables-by-schema` — `SELECT schemaname, tablename FROM pg_tables WHERE schemaname IN ('m_schema_namespace', 'tmp_other') ORDER BY 1, 2`；`support: 'partial'`（在 `qualified-name-cross-schema` 之后跑能看到 tmp_other；之前跑只看到主 schema）

### Task 6 — 写 `index.ts`

`examples` 数组 5 个。

### Task 7 — 注册到 `registry.ts`

## 完成验收 Checklist

### 内容边界
- [ ] 3 个 Section 主语依次为：创建与删除 schema、search_path 与未限定引用、跨 schema 引用与同名冲突
- [ ] 未展开 schema 权限（GRANT ON SCHEMA → ch15）
- [ ] Section 3 mermaid label 无裸 `<` `>` `|`

### 重入安全
- [ ] 所有创建临时 schema 的 example 用 `CREATE SCHEMA IF NOT EXISTS` + 末尾 `DROP SCHEMA IF EXISTS ... CASCADE`
- [ ] `change-search-path-effect` 即使在错误中断也不会留下 `tmp_other` schema（包在 example 末的 cleanup 里）

### 关键 Example 行为
- [ ] `show-current-search-path` 返回的 search_path 含 `m_schema_namespace`
- [ ] `change-search-path-effect` 切换 search_path 后 `SELECT FROM t1` 返回 tmp_other 的数据
- [ ] `qualified-name-cross-schema` 返回 2 行（main + other）
