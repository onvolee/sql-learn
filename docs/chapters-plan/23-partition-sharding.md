# 章节生成任务：23. 分区与分片

> **Agent 开工前必读**：`docs/chapter-template/chapter-template.md`
> 本文件只提供本章节的具体决策与任务清单。

## 章节基本信息

| 字段 | 值 |
|---|---|
| 大纲来源 | `postgresql-study-outline.md` → 「三、高级阶段 → 7. 分区与分片」 |
| group | `advanced` |
| slug | `partition-sharding` |
| schema | `m_partition_sharding` |
| order | 7 |
| 读者画像 | 已会索引（→ ch10）、EXPLAIN（→ ch17） |

## 教学边界

- 覆盖：声明式分区（RANGE / LIST / HASH）、分区裁剪、分区维护、Citus / 分片点到为止
- 不展开：旧式 inheritance 分区（PG 10 前）、Citus 真实部署、跨节点事务

## 任务清单

### Task 1 — 写 `schema.ts`

drizzle 对原生分区支持有限，本章 schema.ts 仅声明 type；表用 seed.sql `CREATE TABLE ... PARTITION BY` 建。

不用 drizzle 表定义；example 全部用 sql template。

### Task 2 — 写 `seed.sql`

```sql
-- RANGE 分区主表 + 4 个 quarter 子表
CREATE TABLE IF NOT EXISTS sales (
  id bigserial,
  region text NOT NULL,
  sold_at date NOT NULL,
  amount numeric(10,2) NOT NULL
) PARTITION BY RANGE (sold_at);

CREATE TABLE IF NOT EXISTS sales_q1 PARTITION OF sales FOR VALUES FROM ('2025-01-01') TO ('2025-04-01');
CREATE TABLE IF NOT EXISTS sales_q2 PARTITION OF sales FOR VALUES FROM ('2025-04-01') TO ('2025-07-01');
CREATE TABLE IF NOT EXISTS sales_q3 PARTITION OF sales FOR VALUES FROM ('2025-07-01') TO ('2025-10-01');
CREATE TABLE IF NOT EXISTS sales_q4 PARTITION OF sales FOR VALUES FROM ('2025-10-01') TO ('2026-01-01');
```

往 `sales` 插 8000 行（每 quarter 2000 行）。

```sql
-- LIST 分区演示表
CREATE TABLE IF NOT EXISTS customers_list (
  id serial,
  region text NOT NULL,
  name text NOT NULL
) PARTITION BY LIST (region);

CREATE TABLE IF NOT EXISTS customers_east PARTITION OF customers_list FOR VALUES IN ('east');
CREATE TABLE IF NOT EXISTS customers_west PARTITION OF customers_list FOR VALUES IN ('west');
CREATE TABLE IF NOT EXISTS customers_other PARTITION OF customers_list DEFAULT;
```

往 `customers_list` 插 60 行。

### Task 3 — 写 Section 1：分区策略概览

- **定义段要点**：声明式分区 / 三种策略：RANGE（区间） / LIST（枚举） / HASH（哈希） / 主表无数据、查询路由到子表 / 适合按时间归档、按 tenant 隔离
- **语法骨架**：ASCII，`PARTITION BY {RANGE|LIST|HASH} (<key>)` + `PARTITION OF <parent> FOR VALUES ...`
- **mermaid**：加。画主表 → 子表分区树
- **Examples**：
  - `list-partitions-of-sales` — `SELECT inhrelid::regclass FROM pg_inherits WHERE inhparent = 'sales'::regclass`；`support: 'partial'`
  - `list-partitions-of-customers` — 同上对 customers_list；`support: 'partial'`

### Task 4 — 写 Section 2：分区裁剪（pruning）

- **定义段要点**：查询带分区键的 WHERE 时 planner 自动跳过不相关分区 / `enable_partition_pruning` 控制（默认 on） / 看 EXPLAIN 输出有「Partitions pruned」提示
- **语法骨架**：ASCII，带分区键的 `WHERE` 形态
- **mermaid**：不加
- **Examples**：
  - `partition-prune-explain` — `EXPLAIN SELECT * FROM sales WHERE sold_at >= '2025-04-01' AND sold_at < '2025-07-01'`；期望只扫 sales_q2；`support: 'partial'`；`timeoutMs: 30000`
  - `partition-no-prune-no-key` — `EXPLAIN SELECT count(*) FROM sales WHERE amount > 100`（不带分区键）期望扫全部子表；`support: 'partial'`；`timeoutMs: 30000`

### Task 5 — 写 Section 3：分区维护（ATTACH / DETACH / DROP）

- **定义段要点**：新季度到来时 `CREATE TABLE` 子表 + `ALTER TABLE <parent> ATTACH PARTITION ...` / 归档老数据：`DETACH PARTITION` 让子表独立，再 DROP 或备份
- **语法骨架**：ASCII，ATTACH / DETACH / CREATE PARTITION OF 三条
- **mermaid**：不加
- **Examples**：
  - `attach-partition` — `CREATE TABLE IF NOT EXISTS sales_q1_2026 (LIKE sales INCLUDING ALL)` + `ALTER TABLE sales ATTACH PARTITION sales_q1_2026 FOR VALUES FROM ('2026-01-01') TO ('2026-04-01')` + 验证 + cleanup（DETACH + DROP）；`support: 'partial'`
  - `detach-partition` — `ALTER TABLE sales DETACH PARTITION sales_q4` + 验证 sales_q4 独立 + ATTACH 还回去；`support: 'partial'`

### Task 6 — 写 Section 4：插入 / 索引 / 约束的特殊点

- **定义段要点**：INSERT 自动路由到合适分区 / **PG 14+** 全局 / 分区索引同步靠 `CREATE INDEX ON <parent>` / FK 必须包含分区键、否则无法跨分区 / UNIQUE 必须包含分区键
- **语法骨架**：ASCII，3 条常见限制
- **mermaid**：不加
- **Examples**：
  - `auto-route-insert` — `INSERT INTO sales (region, sold_at, amount) VALUES ('east', '2025-05-15', 100) RETURNING tableoid::regclass`（看实际落到 sales_q2）；`support: 'partial'`
  - `index-on-parent-propagates` — `CREATE INDEX IF NOT EXISTS sales_region_idx ON sales (region)` + 查 `pg_indexes WHERE schemaname = current_schema() AND tablename LIKE 'sales%'`（含所有子表索引）；含 cleanup；`support: 'partial'`

### Task 7 — 写 Section 5：分片（Citus 点到为止）

- **定义段要点**：分区 = 单实例水平切表 / 分片 = 跨多节点切表 / Citus 扩展把 PG 变分布式 / coordinator + worker 架构 / `create_distributed_table` 选分布键 / 本课程不部署，仅介绍概念
- **语法骨架**：ASCII，Citus 概念组件
- **mermaid**：加。画 coordinator → workers 拓扑 + shard 分布
- **Examples**：
  - `citus-check` — `SELECT name FROM pg_available_extensions WHERE name = 'citus'`（多数返回 0 行是教学点）；`support: 'partial'`

### Task 8 — 写 `index.ts`

`examples` 数组约 10 个。

### Task 9 — 注册到 `registry.ts`

## 完成验收 Checklist

### 内容边界
- [ ] 5 个 Section 主语依次为：分区策略、分区裁剪、维护、插入/索引/约束特殊点、分片
- [ ] Citus 仅点到为止
- [ ] Section 1、5 用 mermaid，label 无裸 `<` `>` `|`

### Schema / Seed
- [ ] sales 8000 行（每 quarter 2000），customers_list 60 行
- [ ] 所有 `CREATE TABLE` / `CREATE TABLE ... PARTITION OF` 用 `IF NOT EXISTS`

### 重入安全
- [ ] `attach-partition` 末尾 DETACH + DROP 新分区
- [ ] `detach-partition` 末尾 ATTACH 还回去

### 关键 Example 行为
- [ ] `partition-prune-explain` EXPLAIN 输出含 `Partitions pruned: 3` 或只扫 sales_q2
- [ ] `auto-route-insert` 返回 `tableoid` 落在 sales_q2
