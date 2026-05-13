# 章节生成任务：5. 数据类型

> **Agent 开工前必读**：`docs/chapter-template/chapter-template.md`
> 本文件只提供本章节的具体决策与任务清单。

## 章节基本信息

| 字段 | 值 |
|---|---|
| 大纲来源 | `postgresql-study-outline.md` → 「一、入门阶段 → 5. 数据类型」 |
| group | `basic` |
| slug | `data-types` |
| schema | `m_data_types` |
| order | 5 |
| 读者画像 | 零 SQL 基础，已熟悉表 / 行 / 列 |

## 教学边界

- 每类**主要给类型行为差异**的 example（VARCHAR vs TEXT、TIMESTAMP vs TIMESTAMPTZ）
- 不深入：JSONB 操作符（→ ch13）、数组高级函数（→ ch16）、RANGE 类型操作（→ ch16）、生成列（→ ch16）、自定义 DOMAIN/ENUM（→ ch16）
- HSTORE 只在「半结构化」一节顺带提一句，不做 example

## 任务清单

### Task 1 — 写 `schema.ts`

`samples` 表覆盖每类一列：
- `id serial PK`
- `n_int integer` / `n_big bigint` / `n_num numeric(10, 4)` / `n_real real`
- `s_text text` / `s_varchar varchar(10)` / `s_char char(5)`
- `t_date date` / `t_ts timestamp` / `t_tstz timestamptz` / `t_interval interval`
- `b_bool boolean`
- `u_uuid uuid`
- `j_jsonb jsonb`
- `a_arr text[]`

### Task 2 — 写 `seed.sql`

`samples` 5 行，覆盖典型值 + 至少一行某些列为 NULL。显式 id + ON CONFLICT。

### Task 3 — 写 Section 1：数值类型

- **定义段要点**：`integer` 32 位 / `bigint` 64 位 / `numeric` 任意精度小数 / `real` 浮点 / 钱用 numeric 不用 real
- **语法骨架**：ASCII，列出 4 个类型的位宽和取值范围
- **mermaid**：不加
- **Examples**：
  - `numeric-precision` — 演示 `numeric(10, 4)` 截断行为，`SELECT 1.23456789::numeric(10, 4)`；`support: 'partial'`
  - `real-vs-numeric-money` — 演示 `0.1 + 0.2` 用 real 不等于 0.3、用 numeric 等于 0.3；`support: 'partial'`
  - `integer-overflow` — 演示 `2147483647 + 1` 在 integer 越界（期望 22003）；`support: 'partial'`

### Task 4 — 写 Section 2：字符串类型

- **定义段要点**：`text` 不限长 / `varchar(n)` 限长 / `char(n)` 限长且**右补空格**（少用） / 三者性能差异在 PG 里几乎为零，优先用 text
- **语法骨架**：ASCII，对比三者长度限制与补空格行为
- **mermaid**：不加
- **Examples**：
  - `char-pads-spaces` — 演示 `'ab'::char(5)` 长度 = 5 含空格；`support: 'partial'`
  - `varchar-length-limit` — 演示插入超过 `varchar(10)` 的字符串报错（22001）；`support: 'partial'`
  - `text-no-limit` — text 列任意长度都接受；drizzle DSL；`support: 'full'`

### Task 5 — 写 Section 3：时间类型

- **定义段要点**：`date` 只日期 / `timestamp` 日期 + 时间无时区 / `timestamptz` 带时区（**内部存 UTC**） / `interval` 时间差 / 业务**优先用 timestamptz**
- **语法骨架**：ASCII，4 个类型 + 文字时间字面量示例
- **mermaid**：不加
- **Examples**：
  - `now-vs-current-date` — `SELECT now(), current_date, current_timestamp`；`support: 'partial'`
  - `timestamp-tz-difference` — 同一字面量 `'2026-01-01 00:00:00'` 插入 timestamp 和 timestamptz 列后用不同 timezone 看出来值不同；`support: 'partial'`
  - `interval-arithmetic` — `SELECT now() + interval '7 days'`；`support: 'partial'`

### Task 6 — 写 Section 4：布尔与 UUID

- **定义段要点**：`boolean` 三值（true / false / NULL） / `uuid` 128 位标识 / `gen_random_uuid()` 内建（PG 13+） / UUID 主键利于分布式
- **语法骨架**：ASCII，boolean 字面量 + `gen_random_uuid()` 调用
- **mermaid**：不加
- **Examples**：
  - `bool-three-values` — `SELECT NULL::boolean = NULL` 返回 NULL（演示三值逻辑）；`support: 'partial'`
  - `uuid-generate` — `SELECT gen_random_uuid()`；`support: 'partial'`

### Task 7 — 写 Section 5：半结构化与集合

- **定义段要点**：`jsonb` 二进制 JSON（详在 ch13） / `text[]` 数组（详在 ch16） / `range` 范围类型（详在 ch16） / `hstore` 扁平 KV（扩展，少用） / 本节只「看一眼形态」
- **语法骨架**：ASCII，`jsonb` 字面量 + `ARRAY[...]` 字面量 + `int4range(...)`
- **mermaid**：不加
- **Examples**：
  - `jsonb-literal` — `SELECT '{"k": 1, "v": [1, 2]}'::jsonb`；`support: 'partial'`
  - `array-literal` — `SELECT ARRAY['a', 'b', 'c']`；`support: 'partial'`
  - `range-literal` — `SELECT int4range(1, 10)`；`support: 'partial'`

### Task 8 — 写 `index.ts`

`examples` 数组 14 个。

### Task 9 — 注册到 `registry.ts`

## 完成验收 Checklist

### 内容边界
- [ ] 5 个 Section 主语依次为：数值、字符串、时间、布尔与 UUID、半结构化与集合
- [ ] 每节 example 突出**类型行为差异**（不只是「能存这种值」）
- [ ] JSONB 操作符、ARRAY 高级函数、RANGE 操作均未展开（指向后续章节）

### Schema / Seed
- [ ] `samples` 表覆盖大纲列出的所有类型族
- [ ] seed 5 行含至少一行某些列为 NULL

### 关键 Example 行为
- [ ] `integer-overflow` 返回 SQLSTATE 22003
- [ ] `varchar-length-limit` 返回 SQLSTATE 22001
- [ ] `char-pads-spaces` 返回长度 = 5 的字符串
