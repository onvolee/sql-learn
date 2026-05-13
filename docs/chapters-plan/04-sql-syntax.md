# 章节生成任务：4. SQL 基础语法

> **Agent 开工前必读**：`docs/chapter-template/chapter-template.md`
> 本文件只提供本章节的具体决策与任务清单。

## 章节基本信息

| 字段 | 值 |
|---|---|
| 大纲来源 | `postgresql-study-outline.md` → 「一、入门阶段 → 4. SQL 基础语法」 |
| group | `basic` |
| slug | `sql-syntax` |
| schema | `m_sql_syntax` |
| order | 4 |
| 读者画像 | 零 SQL 基础，刚看过前 3 章 |

## 章节定位（与既有 `curd` 模块的关系）

`basic/curd` 已用大量 example 演示了 `INSERT/SELECT/UPDATE/DELETE` 的具体写法。本章**不重复 demo**，定位是「四大类 SQL 的总览 + DDL 和 DCL 的实操（curd 没覆盖）」。DML / DQL 在本章只给「一句话定义 + 指路到 curd」。

## 教学边界

- DML / DQL 部分**不复制** curd 的 example，只点到名词；详细 demo 在 curd
- 不展开数据类型选型（→ ch05）、约束细节（→ ch07）、Schema 跨引用（→ ch08）
- DCL 部分只演示「创建角色 + GRANT 表权限 + 验证」最小闭环，不展开 RLS / 角色继承（→ ch15）

## 任务清单

### Task 1 — 写 `schema.ts`

`employees` 表方便演示 DDL、GROUP BY、权限：
- `id serial PK`
- `name text NOT NULL`
- `dept text NOT NULL`
- `salary numeric(10, 2) NOT NULL`

### Task 2 — 写 `seed.sql`

`employees` 10 行，覆盖 3 个 dept（每个部门 2-4 人，便于 GROUP BY）。显式 `id` + `ON CONFLICT DO NOTHING`。

### Task 3 — 写 Section 1：DDL — CREATE / ALTER / DROP

- **定义段要点**：DDL = Data Definition Language / 改的是「结构」而非「数据」 / 三个核心动词 CREATE / ALTER / DROP / 作用对象包括 TABLE、INDEX、VIEW、SEQUENCE 等
- **语法骨架**：mermaid，分支结构展示 CREATE/ALTER/DROP 各自的常见对象
- **mermaid**：加。label 用 HTML entity 处理 `<` `>` `|`
- **Examples**（example 之间需要顺序无关 + 可重入；用临时副表 `employees_archive` 避免污染主表）：
  - `ddl-create-table` — `CREATE TABLE IF NOT EXISTS employees_archive (LIKE employees INCLUDING ALL)`；`support: 'partial'`
  - `ddl-alter-add-column` — `ALTER TABLE employees_archive ADD COLUMN IF NOT EXISTS archived_at timestamptz DEFAULT now()`；`support: 'partial'`
  - `ddl-alter-rename-column` — 用 DO 块判断列存在再 `ALTER TABLE ... RENAME COLUMN`（保证重入）；`support: 'partial'`
  - `ddl-drop-table` — `DROP TABLE IF EXISTS employees_archive`；`support: 'partial'`

### Task 4 — 写 Section 2：DML — INSERT / UPDATE / DELETE

- **定义段要点**：DML = Data Manipulation Language / 改的是「数据」 / `INSERT` 写入、`UPDATE` 改、`DELETE` 删 / 详细 demo 在 `basic/curd`，本节只给「最小一行 SQL」对照
- **语法骨架**：ASCII，三个语句各一条最短形式
- **mermaid**：不加
- **Examples**：
  - `dml-insert-min` — drizzle DSL 单行 insert + `onConflictDoNothing`；`support: 'full'`
  - `dml-update-min` — drizzle DSL 用表达式（`SET salary = salary + 1`，重入安全）；`support: 'full'`
  - `dml-delete-min` — 先 `INSERT (id=999, ...) ON CONFLICT DO NOTHING` 再 `DELETE WHERE id=999`，保证 example 自洽；`support: 'full'`

### Task 5 — 写 Section 3：DQL — SELECT 的全貌

- **定义段要点**：DQL = Data Query Language / 唯一动词 SELECT / 子句顺序固定：`SELECT/FROM/WHERE/GROUP BY/HAVING/ORDER BY/LIMIT` / 详细子句 demo 在 curd，本节只展示「带分组的完整形态」
- **语法骨架**：ASCII，完整 SELECT 各子句顺序
- **mermaid**：不加
- **Examples**：
  - `dql-group-having` — drizzle DSL，按 dept 分组、过滤 avg(salary) > 5000；`support: 'full'`
  - `dql-order-limit` — drizzle DSL，按 salary desc + limit 3；`support: 'full'`

### Task 6 — 写 Section 4：DCL — GRANT / REVOKE

- **定义段要点**：DCL = Data Control Language / 改的是「权限」 / `GRANT` 授予、`REVOKE` 收回 / 作用于角色（ROLE） / 权限继承与 RLS 详在 ch15
- **语法骨架**：ASCII，`GRANT <privilege> ON <object> TO <role>` + `REVOKE` 同形
- **mermaid**：不加
- **Examples**（用 DO 块或 `CREATE ROLE IF NOT EXISTS` 模式保证可重入；PG 无 `CREATE ROLE IF NOT EXISTS`，用 `DO $$ BEGIN IF NOT EXISTS (...) THEN CREATE ROLE ... END IF; END $$`）：
  - `dcl-create-role` — 创建只读角色 `m_sql_syntax_reader`；`support: 'partial'`
  - `dcl-grant-select` — `GRANT SELECT ON employees TO m_sql_syntax_reader`；`support: 'partial'`
  - `dcl-inspect-grants` — 查 `information_schema.role_table_grants` 验证；`support: 'partial'`
  - `dcl-revoke-select` — `REVOKE SELECT ON employees FROM m_sql_syntax_reader`；`support: 'partial'`

### Task 7 — 写 `index.ts`

`examples` 数组 13 个，按 index.md 顺序。

### Task 8 — 注册到 `registry.ts`

## 完成验收 Checklist

### 内容边界
- [ ] DML / DQL Section 没有重复 curd 模块的 example 数量；只给「最小一行 SQL」对照
- [ ] DCL Section 未展开 RLS / 角色继承（指向 ch15）
- [ ] 4 个 Section 主语依次为：DDL、DML、DQL、DCL
- [ ] Section 1 用 mermaid（分支结构），label 无裸 `<` `>` `|`

### 重入安全
- [ ] DDL example 用临时表 `employees_archive`（不污染主表）
- [ ] 所有 DDL 都用 `IF EXISTS` / `IF NOT EXISTS`
- [ ] DCL 创建 ROLE 用 DO 块判断存在
- [ ] DML update / delete example 使用表达式或临时 id

### 关键 Example 行为
- [ ] `dql-group-having` 返回至少 1 行（dept 的 avg salary > 5000）
- [ ] `dcl-inspect-grants` 在 `dcl-grant-select` 跑后返回相关行
