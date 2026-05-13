# 章节生成任务：17. 查询优化与执行计划

> **Agent 开工前必读**：`docs/chapter-template/chapter-template.md`
> 本文件只提供本章节的具体决策与任务清单。

## 章节基本信息

| 字段 | 值 |
|---|---|
| 大纲来源 | `postgresql-study-outline.md` → 「三、高级阶段 → 1. 查询优化与执行计划」 |
| group | `advanced` |
| slug | `performance` |
| schema | `m_performance` |
| order | 1 |
| 读者画像 | 已会索引（→ ch10）、JOIN（→ ch09） |

## 教学边界

- 覆盖：EXPLAIN / EXPLAIN ANALYZE、常见节点（Seq Scan / Index Scan / Bitmap / Sort / Hash Join / Merge Join / Nested Loop）、ANALYZE 统计、查询改写思路、索引诊断
- 不展开：planner cost 参数调优（→ ch21）、并行查询深入、JIT

## 任务清单

### Task 1 — 写 `schema.ts`

- `orders(id bigserial PK, customer_id int NOT NULL, status text NOT NULL, total numeric(10, 2) NOT NULL, created_at timestamptz NOT NULL DEFAULT now())`
- `customers(id serial PK, name text NOT NULL, region text NOT NULL)`

### Task 2 — 写 `seed.sql`

- `customers` 1000 行
- `orders` **10 万行**，关联 customer_id，status 取 3 种值（pending / paid / shipped），日期跨 1 年
- 跑 `ANALYZE customers; ANALYZE orders;` 让统计准确
- 大表 example 全部 `timeoutMs: 30000`

### Task 3 — 写 Section 1：EXPLAIN 基础

- **定义段要点**：`EXPLAIN <sql>` 只看计划 / `EXPLAIN ANALYZE <sql>` 实际跑并加实测时间 / `(BUFFERS)` 看 buffer 命中、`(FORMAT JSON)` 机器可读 / 缩进表示节点嵌套，从下往上读
- **语法骨架**：ASCII，`EXPLAIN [( ANALYZE, BUFFERS, FORMAT TEXT|JSON )] <stmt>`
- **mermaid**：不加
- **Examples**：
  - `explain-plain` — `EXPLAIN SELECT * FROM orders WHERE customer_id = 42`；`support: 'partial'`；`timeoutMs: 30000`
  - `explain-analyze-buffers` — `EXPLAIN (ANALYZE, BUFFERS) ...`；`support: 'partial'`；`timeoutMs: 30000`
  - `explain-format-json` — `EXPLAIN (FORMAT JSON) ...`；`support: 'partial'`；`timeoutMs: 30000`

### Task 4 — 写 Section 2：扫描节点 — Seq / Index / Bitmap

- **定义段要点**：`Seq Scan` 顺序扫全表 / `Index Scan` 走索引取行 / `Index Only Scan` 全列在索引里、无需访问堆 / `Bitmap Index Scan + Bitmap Heap Scan` 多索引或大量行场景 / Planner 按估算选择
- **语法骨架**：ASCII，4 种扫描节点对照
- **mermaid**：加。画一棵扫描节点决策树（小量行 → Index Scan / 大量行 → Seq Scan / 多索引交并 → Bitmap）
- **Examples**：
  - `force-seq-scan` — 无适合索引时 EXPLAIN，应见 Seq Scan；`support: 'partial'`；`timeoutMs: 30000`
  - `index-scan` — 建索引后 EXPLAIN 等值查询；`support: 'partial'`；`timeoutMs: 30000`
  - `bitmap-scan-or` — 两个独立条件 `WHERE customer_id = ? OR status = ?` 期望 BitmapOr；`support: 'partial'`；`timeoutMs: 30000`

### Task 5 — 写 Section 3：JOIN 算法 — Nested Loop / Hash / Merge

- **定义段要点**：`Nested Loop` 适合一边很小 / `Hash Join` 大表 + 等值，建哈希表 / `Merge Join` 两边已有序、归并 / planner 选哪种取决于表大小、索引、统计
- **语法骨架**：ASCII，3 种 JOIN 算法对照表
- **mermaid**：不加
- **Examples**：
  - `nested-loop-small` — 一边 LIMIT 1 + JOIN 另一边，期望 Nested Loop；`support: 'partial'`；`timeoutMs: 30000`
  - `hash-join-large` — `customers JOIN orders ON ... WHERE ...` 期望 Hash Join；`support: 'partial'`；`timeoutMs: 30000`

### Task 6 — 写 Section 4：聚合、排序、Limit

- **定义段要点**：`Aggregate` / `HashAggregate` 聚合 / `Sort` 排序（带 Memory 或 Disk）/ `Limit` 限行 / Sort + Limit 时若有匹配索引可省去 Sort
- **语法骨架**：ASCII，常见聚合 / 排序节点对照
- **mermaid**：不加
- **Examples**：
  - `agg-hash` — `GROUP BY customer_id` 期望 HashAggregate；`support: 'partial'`；`timeoutMs: 30000`
  - `sort-then-limit` — `ORDER BY total DESC LIMIT 10` 在 total 无索引时含 Sort 节点；`support: 'partial'`；`timeoutMs: 30000`
  - `index-skips-sort` — 建索引 `(total DESC)` 后再跑同查询，Sort 节点消失；`support: 'partial'`；`timeoutMs: 30000`

### Task 7 — 写 Section 5：ANALYZE 与统计信息

- **定义段要点**：planner 决策依赖 `pg_statistic` 里的统计（行数、distinct、NULL 比例、直方图） / `ANALYZE` 重采样统计 / 表大变动后建议手动 ANALYZE / autovacuum 默认会跑（→ ch18）
- **语法骨架**：ASCII，`ANALYZE [VERBOSE] [<table>]`
- **mermaid**：不加
- **Examples**：
  - `analyze-table` — `ANALYZE orders`；`support: 'partial'`
  - `pg-stats-inspect` — `SELECT attname, n_distinct, null_frac FROM pg_stats WHERE schemaname = 'm_performance' AND tablename = 'orders'`；`support: 'partial'`

### Task 8 — 写 Section 6：查询改写与索引诊断思路

- **定义段要点**：常见问题：缺少索引、SELECT * 让 Index Only Scan 退化、函数包裹列阻止索引、OR 条件该用 UNION ALL、隐式类型转换让索引失效 / 用 EXPLAIN ANALYZE 找 Actual Rows vs Estimated Rows 差距大就是统计或写法问题
- **语法骨架**：ASCII，5 条常见反模式
- **mermaid**：不加
- **Examples**：
  - `function-on-column-blocks-index` — `WHERE lower(name) = 'alice'` 无索引时 Seq Scan，加表达式索引后 Index Scan；`support: 'partial'`；`timeoutMs: 30000`
  - `implicit-cast-blocks-index` — `WHERE customer_id = '42'`（字符串 vs int）演示 cast 影响；`support: 'partial'`；`timeoutMs: 30000`

### Task 9 — 写 `index.ts`

`examples` 数组约 14 个；所有 EXPLAIN/大表 example 设 `timeoutMs: 30000`。

### Task 10 — 注册到 `registry.ts`

## 完成验收 Checklist

### 内容边界
- [ ] 6 个 Section 主语依次为：EXPLAIN 基础、扫描节点、JOIN 算法、聚合/排序/Limit、ANALYZE 与统计、查询改写
- [ ] 未深入 planner cost 参数（→ ch21）
- [ ] Section 2 mermaid label 无裸 `<` `>` `|`

### Schema / Seed
- [ ] orders ≥ 10 万行
- [ ] seed 末尾跑 `ANALYZE orders; ANALYZE customers;`

### 关键 Example 行为
- [ ] `force-seq-scan` 输出含 `Seq Scan`
- [ ] `index-scan` 输出含 `Index Scan`
- [ ] `index-skips-sort` 输出**不含** `Sort` 节点
- [ ] 所有 EXPLAIN example `timeoutMs: 30000`
