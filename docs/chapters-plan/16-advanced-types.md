# 章节生成任务：16. 高级数据类型

> **Agent 开工前必读**：`docs/chapter-template/chapter-template.md`
> 本文件只提供本章节的具体决策与任务清单。

## 章节基本信息

| 字段 | 值 |
|---|---|
| 大纲来源 | `postgresql-study-outline.md` → 「二、中级阶段 → 8. 高级数据类型」 |
| group | `intermediate` |
| slug | `advanced-types` |
| schema | `m_advanced_types` |
| order | 8 |
| 读者画像 | 已会基础类型（→ ch05）、约束（→ ch07） |

## 教学边界

- 覆盖：数组、范围、GENERATED 列（存储列）、DOMAIN、ENUM
- 不展开：复合类型（ROW）、jsonb（→ ch13）、全文 tsvector（→ ch14）、几何类型

## 任务清单

### Task 1 — 写 `schema.ts`

- `users(id serial PK, name text NOT NULL, age int NOT NULL, age_group text GENERATED ALWAYS AS (CASE WHEN age < 18 THEN 'minor' WHEN age < 60 THEN 'adult' ELSE 'senior' END) STORED, tags text[] NOT NULL DEFAULT '{}')`
- `bookings(id serial PK, room text NOT NULL, during tstzrange NOT NULL)`
- DOMAIN + ENUM 在 seed 里建

### Task 2 — 写 `seed.sql`

- `CREATE DOMAIN IF NOT EXISTS email_t AS text CHECK (VALUE ~ '^[^@]+@[^@]+$')`（PG 实际无 `IF NOT EXISTS`，要用 `DO $$ ... $$` 检测后建，或 example 内用 `DROP DOMAIN IF EXISTS` + CREATE）
- `CREATE TYPE IF NOT EXISTS color_t AS ENUM ('red', 'green', 'blue')`（同上，用 DO 块）
- `users` 6 行（含不同 age 段、不同 tags 数组）
- `bookings` 5 行（含重叠区间撑约束 example）

### Task 3 — 写 Section 1：数组类型

- **定义段要点**：任何标量类型都可加 `[]` 变数组 / 字面量 `'{a,b,c}'` 或 `ARRAY['a','b','c']` / 1-indexed / 多维支持但慎用 / 操作符 `@>` `<@` `&&` 走 GIN
- **语法骨架**：ASCII，`<type>[]` 声明 + 常用操作符
- **mermaid**：不加
- **Examples**：
  - `array-insert` — 插一行带 tags；drizzle DSL；`support: 'full'`
  - `array-operators` — `tags @> ARRAY['admin']`、`tags && ARRAY['admin','beta']`；`support: 'partial'`
  - `array-unnest` — `SELECT name, t FROM users, unnest(tags) t`；`support: 'partial'`
  - `array-agg` — `SELECT array_agg(name) FROM users`；`support: 'partial'`

### Task 4 — 写 Section 2：范围类型

- **定义段要点**：`int4range` / `numrange` / `tsrange` / `tstzrange` / `daterange` / 写法 `'[lower, upper)'`（方括号闭，圆括号开） / 操作符：`@>` 包含点、`&&` 重叠 / EXCLUDE 约束用 GiST 防重叠
- **语法骨架**：ASCII，范围字面量 + 常用操作符
- **mermaid**：不加
- **Examples**：
  - `range-overlap` — `WHERE during && tstzrange(now(), now() + interval '1 hour')`；`support: 'partial'`
  - `range-contains-point` — `WHERE during @> now()`；`support: 'partial'`
  - `exclude-no-overlap` — 演示 `ALTER TABLE bookings ADD CONSTRAINT no_overlap EXCLUDE USING gist (room WITH =, during WITH &&)` 然后试插重叠期望失败；含 cleanup；`support: 'partial'`

### Task 5 — 写 Section 3：GENERATED 列

- **定义段要点**：`GENERATED ALWAYS AS (expr) STORED` 自动算出存储 / 只能用 `STORED`，PG 暂不支持 `VIRTUAL` / 不能在 GENERATED 列上手动写值 / 适合反规范化的派生数据
- **语法骨架**：ASCII，`<col> <type> GENERATED ALWAYS AS (<expr>) STORED`
- **mermaid**：不加
- **Examples**：
  - `generated-column-read` — `SELECT name, age, age_group FROM users`；`support: 'partial'`
  - `generated-column-write-fails` — 试图 `INSERT (..., age_group)` 期望失败；`support: 'partial'`

### Task 6 — 写 Section 4：DOMAIN

- **定义段要点**：DOMAIN = 给已有类型套一层「带约束的别名」 / `CHECK` 约束在写入时校验 / 在多张表想用同样约束时省事
- **语法骨架**：ASCII，`CREATE DOMAIN <name> AS <type> CHECK (...)`
- **mermaid**：不加
- **Examples**：
  - `domain-define-and-use` — 一个 example 内：`DO $$ BEGIN ... CREATE DOMAIN email_t ... END $$`（或 `DROP DOMAIN IF EXISTS` 后 CREATE） + `CREATE TEMP TABLE contacts (e email_t)` + 试写合法、非法各一行 + 末尾 DROP；`support: 'partial'`

### Task 7 — 写 Section 5：ENUM

- **定义段要点**：`CREATE TYPE <name> AS ENUM (...)` 定义枚举 / 比 text + CHECK 约束更紧凑、有顺序 / 加新值用 `ALTER TYPE ADD VALUE` / 改值要重建
- **语法骨架**：ASCII，`CREATE TYPE <name> AS ENUM (...)` + `ALTER TYPE ... ADD VALUE`
- **mermaid**：不加
- **Examples**：
  - `enum-define-and-use` — `DO $$` 块建 color_t + 临时表 + 插合法 + 试插非法期望 22P02 + DROP；`support: 'partial'`
  - `enum-add-value` — `ALTER TYPE color_t ADD VALUE IF NOT EXISTS 'yellow'` + 验证 `SELECT enum_range(NULL::color_t)`；`support: 'partial'`（注意 ALTER TYPE ADD VALUE 不能在事务中跟使用同 enum 的语句一起执行，example 末尾不能立刻用 yellow，仅看 enum_range）

### Task 8 — 写 `index.ts`

`examples` 数组约 13 个。

### Task 9 — 注册到 `registry.ts`

## 完成验收 Checklist

### 内容边界
- [ ] 5 个 Section 主语依次为：数组、范围、GENERATED、DOMAIN、ENUM
- [ ] 未引入复合类型 ROW / jsonb / 几何

### Schema / Seed
- [ ] users 含 GENERATED age_group 列 + tags 数组
- [ ] bookings 含 tstzrange 列、5 行预置数据
- [ ] DOMAIN / ENUM 用 `DO $$ BEGIN IF NOT EXISTS ... END $$` 块预建（PG 无 `CREATE DOMAIN IF NOT EXISTS`）

### 重入安全
- [ ] `exclude-no-overlap` 末尾 `ALTER TABLE bookings DROP CONSTRAINT IF EXISTS no_overlap`
- [ ] `domain-define-and-use` / `enum-define-and-use` 末尾 DROP 临时对象

### 关键 Example 行为
- [ ] `array-operators` 至少返回 1 行
- [ ] `range-overlap` 在覆盖时间内的 booking 被命中
- [ ] `generated-column-write-fails` 报错（不能写 GENERATED 列）
- [ ] `enum-add-value` 后 enum_range 含 yellow
