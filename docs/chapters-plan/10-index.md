# 章节生成任务：10. 索引

> **Agent 开工前必读**：`docs/chapter-template/chapter-template.md`
> 本文件只提供本章节的具体决策与任务清单。

## 章节基本信息

| 字段 | 值 |
|---|---|
| 大纲来源 | `postgresql-study-outline.md` → 「二、中级阶段 → 2. 索引」 |
| group | `intermediate` |
| slug | `index` |
| schema | `m_index` |
| order | 2 |
| 读者画像 | 已会基础 CRUD，知道索引是「单独存在的查找对象」（ch01 Section 3） |

## 教学边界

- 5 种索引类型 + 4 种索引特性（部分 / 表达式 / 覆盖 / 唯一）
- 用 `EXPLAIN` 看是否走索引，**但不深入执行计划节点**（→ ch17）
- 不展开：索引膨胀（→ ch18）、并发建索引 `CONCURRENTLY` 的死锁陷阱、索引在 VACUUM 中的处理（→ ch18）

## 任务清单

### Task 1 — 写 `schema.ts`

两张表撑各类索引演示：
- `events(id bigserial PK, ts timestamptz NOT NULL, kind text NOT NULL, payload jsonb NOT NULL, tags text[] NOT NULL)`
- `places(id serial PK, name text NOT NULL, location text NOT NULL)` — 用 text 模拟 geometry（PG 自带的 point 类型也可）

### Task 2 — 写 `seed.sql`

- `events` **1 万行**，用 `generate_series` 生成。`ts` 横跨 1 年，`kind` 取 5 种值，`payload` 含 `{"user_id": <random>, "amount": <random>}`，`tags` 随机 2-3 个标签
- `places` 50 行
- 注意：所有大表 example 加 `timeoutMs: 30000`

### Task 3 — 写 Section 1：B-tree — 默认类型

- **定义段要点**：默认索引类型 / 支持等值 + 范围 + ORDER BY / 适合大多数标量列 / 主键自带 B-tree
- **语法骨架**：ASCII，`CREATE INDEX <name> ON <table> (<col>)`（不指定 USING 默认 btree）
- **mermaid**：加。画 B-tree 三层示意（根节点 → 中间节点 → 叶节点指向 ctid）
- **Examples**：
  - `btree-create-and-explain` — `CREATE INDEX IF NOT EXISTS events_ts_idx ON events (ts)` + `EXPLAIN SELECT * FROM events WHERE ts > now() - interval '7 days' LIMIT 100`；`support: 'partial'`；`timeoutMs: 30000`
  - `btree-range-scan` — EXPLAIN 范围查询；`support: 'partial'`

### Task 4 — 写 Section 2：Hash — 仅等值

- **定义段要点**：只支持 `=` 等值 / PG 10+ 才完整支持（WAL 完备） / 大多数场景被 B-tree 等值用法覆盖，实用场景少
- **语法骨架**：ASCII，`CREATE INDEX <name> ON <table> USING hash (<col>)`
- **mermaid**：不加
- **Examples**：
  - `hash-create-and-explain` — Hash index + EXPLAIN 等值查询；`support: 'partial'`；`timeoutMs: 30000`

### Task 5 — 写 Section 3：GIN — JSONB / 数组 / 全文

- **定义段要点**：通用倒排索引 / 适合「元素属于集合」类查询 / JSONB `@>` `?` 操作符走 GIN / 数组 `&&` `@>` 走 GIN / 全文搜索 tsvector 走 GIN
- **语法骨架**：ASCII，`USING gin` + 三类 opclass（jsonb_path_ops 等）
- **mermaid**：不加
- **Examples**：
  - `gin-jsonb` — `CREATE INDEX IF NOT EXISTS events_payload_gin ON events USING gin (payload)` + `EXPLAIN SELECT * FROM events WHERE payload @> '{"user_id": 1}'`；`support: 'partial'`；`timeoutMs: 30000`
  - `gin-array` — `CREATE INDEX IF NOT EXISTS events_tags_gin ON events USING gin (tags)` + `EXPLAIN SELECT * FROM events WHERE tags && ARRAY['foo']`；`support: 'partial'`；`timeoutMs: 30000`

### Task 6 — 写 Section 4：GiST — 范围 / 几何

- **定义段要点**：通用搜索树 / 支持范围、几何、全文等需要「叠加 / 包含 / 距离」查询 / PostGIS 的核心索引
- **语法骨架**：ASCII，`USING gist`
- **mermaid**：不加
- **Examples**：
  - `gist-range` — 在 events 加一个范围列演示（或临时建一张含 `tsrange` 列的 demo 表 + GiST + 范围重叠查询 `&&`）；`support: 'partial'`

### Task 7 — 写 Section 5：BRIN — 超大有序表

- **定义段要点**：Block Range Index / 只记录每个 block range 的 min/max / 索引极小 / 适合天然有序的超大表（如时间日志） / 不适合随机分布
- **语法骨架**：ASCII，`USING brin`
- **mermaid**：不加
- **Examples**：
  - `brin-on-ts` — `CREATE INDEX IF NOT EXISTS events_ts_brin ON events USING brin (ts)` + EXPLAIN 范围；`support: 'partial'`；`timeoutMs: 30000`
  - `brin-vs-btree-size` — `SELECT pg_size_pretty(pg_relation_size('events_ts_idx')), pg_size_pretty(pg_relation_size('events_ts_brin'))` 对比体积；`support: 'partial'`

### Task 8 — 写 Section 6：索引特性（部分 / 表达式 / 覆盖 / 唯一）

- **定义段要点**：部分索引 = 带 `WHERE` 只索引一部分 / 表达式索引 = 索引一个函数返回值 / 覆盖索引 = `INCLUDE` 把额外列带进叶子节点供 Index Only Scan / 唯一索引 = `UNIQUE` 索引同时充当约束
- **语法骨架**：ASCII，4 种特性各一条
- **mermaid**：不加
- **Examples**：
  - `partial-index` — `CREATE INDEX ... WHERE kind = 'error'` + EXPLAIN；`support: 'partial'`
  - `expression-index` — `CREATE INDEX ... ON events (lower(kind))` + `EXPLAIN WHERE lower(kind) = 'error'`；`support: 'partial'`
  - `covering-index` — `CREATE INDEX ... ON events (ts) INCLUDE (kind)` + EXPLAIN 看 Index Only Scan；`support: 'partial'`
  - `unique-index-as-constraint` — `CREATE UNIQUE INDEX IF NOT EXISTS uq_places_name ON places (name)` + 插重复名期望 23505；`support: 'partial'`

### Task 9 — 写 `index.ts`

`examples` 数组约 13 个；所有 EXPLAIN 大表 example 设 `timeoutMs: 30000`。

### Task 10 — 注册到 `registry.ts`

## 完成验收 Checklist

### 内容边界
- [ ] 6 个 Section 主语依次为：B-tree、Hash、GIN、GiST、BRIN、索引特性（部分/表达式/覆盖/唯一）
- [ ] EXPLAIN 结果只点到「Index Scan 出现」即止，不深入执行计划节点（→ ch17）
- [ ] 未展开 `CONCURRENTLY`、索引膨胀、并发风险

### Schema / Seed
- [ ] `events` 表至少 1 万行（`generate_series`）
- [ ] `payload` 含 `user_id`、`amount`；`tags` 是随机 2-3 元素数组
- [ ] `places` 50 行

### 重入安全
- [ ] 所有 `CREATE INDEX` 用 `IF NOT EXISTS`
- [ ] 临时表 / 临时列演示用 `IF NOT EXISTS` + 末尾 cleanup

### 关键 Example 行为
- [ ] `btree-create-and-explain` 的 EXPLAIN 输出含 `Index Scan` 或 `Index Only Scan`
- [ ] `gin-jsonb` 的 EXPLAIN 输出含 `Bitmap Index Scan`
- [ ] `brin-vs-btree-size` 中 brin 索引体积显著小于 btree
- [ ] 所有大表 example 的 `timeoutMs: 30000`
