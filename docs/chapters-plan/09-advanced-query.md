# 章节生成任务：9. 高级查询

> **Agent 开工前必读**：`docs/chapter-template/chapter-template.md`
> 本文件只提供本章节的具体决策与任务清单。

## 章节基本信息

| 字段 | 值 |
|---|---|
| 大纲来源 | `postgresql-study-outline.md` → 「二、中级阶段 → 1. 高级查询」 |
| group | `intermediate` |
| slug | `advanced-query` |
| schema | `m_advanced_query` |
| order | 1 |
| 读者画像 | 已会基础 CRUD、主外键、单表 SELECT（参见模板「基础已会」） |

## 教学边界

- 覆盖 6 大主题：JOIN、子查询、EXISTS/IN/ANY/ALL、集合运算、CTE、窗口函数
- 不展开：JOIN 算法（→ ch17 执行计划）、CTE 物化与优化栅栏（→ ch17）、窗口函数性能（→ ch17）
- LATERAL JOIN 给一个 example 即可，不深入复杂用法

## 任务清单

### Task 1 — 写 `schema.ts`

经典 e-commerce 三表：
- `customers(id serial PK, name text NOT NULL, region text NOT NULL)`
- `products(id serial PK, name text NOT NULL, price numeric(10, 2) NOT NULL)`
- `orders(id serial PK, customer_id int NOT NULL REFERENCES customers(id), product_id int NOT NULL REFERENCES products(id), qty int NOT NULL, ordered_at timestamptz NOT NULL DEFAULT now())`

### Task 2 — 写 `seed.sql`

- `customers` 6 行（3 个 region 各 2 人）
- `products` 5 行（价格分布 10~1000）
- `orders` 25 行（覆盖多个 customer × product 组合，含一个 customer 完全没下单的）

显式 id + ON CONFLICT。

### Task 3 — 写 Section 1：JOIN（INNER / LEFT / RIGHT / FULL / CROSS / LATERAL）

- **定义段要点**：JOIN 把多表按条件拼成一张大表 / 6 种 JOIN 区别在「不匹配的行怎么办」 / INNER 丢弃、LEFT 保留左表、RIGHT 保留右表、FULL 都保留、CROSS 笛卡尔积、LATERAL 让右表引用左表
- **语法骨架**：mermaid，按从最常用到最少用排列 6 种 JOIN 的差异图
- **mermaid**：加。画 Venn / 三角示意 + label 用 HTML entity
- **Examples**：
  - `join-inner` — 客户-订单 INNER JOIN；drizzle DSL；`support: 'full'`
  - `join-left-find-no-orders` — LEFT JOIN 找出没下过单的客户（`WHERE o.id IS NULL`）；drizzle DSL；`support: 'full'`
  - `join-full` — FULL OUTER JOIN；`support: 'partial'`（drizzle 对 FULL 支持视版本）
  - `join-cross` — `customers CROSS JOIN products`；`support: 'partial'`
  - `join-lateral` — 每个客户拿最近 1 单：`SELECT c.name, last.id FROM customers c LEFT JOIN LATERAL (SELECT id FROM orders WHERE customer_id = c.id ORDER BY ordered_at DESC LIMIT 1) last ON true`；`support: 'partial'`

### Task 4 — 写 Section 2：子查询与相关子查询

- **定义段要点**：子查询 = SELECT 嵌在另一 SELECT 里 / 标量子查询返回单值 / 集合子查询返回多行 / 相关子查询 = 内层引用外层列，每行重新求值 / FROM 子句里也可放子查询（派生表）
- **语法骨架**：ASCII，列 SELECT 列、WHERE、FROM 三处可放子查询的形态
- **mermaid**：不加
- **Examples**：
  - `subquery-scalar` — `SELECT name, (SELECT count(*) FROM orders WHERE customer_id = c.id) AS n FROM customers c`；`support: 'partial'`
  - `subquery-derived` — `SELECT region, total FROM (SELECT region, sum(qty * p.price) AS total FROM ... GROUP BY region) t WHERE total > 100`；`support: 'partial'`
  - `subquery-correlated` — 找下单数 > region 均值的客户；`support: 'partial'`

### Task 5 — 写 Section 3：EXISTS / IN / ANY / ALL

- **定义段要点**：四种「集合存在性」表达 / `EXISTS` 看子查询是否有行 / `IN` 看值是否在集合里 / `ANY` 与某个比较 / `ALL` 与所有比较 / 大数据集时 EXISTS 通常优于 IN
- **语法骨架**：ASCII，4 种形态各一行对比
- **mermaid**：不加
- **Examples**：
  - `exists-customers-with-orders` — `WHERE EXISTS (SELECT 1 FROM orders WHERE customer_id = c.id)`；`support: 'partial'`
  - `in-products-ordered` — `WHERE id IN (SELECT product_id FROM orders)`；`support: 'partial'`
  - `any-price-greater` — `WHERE price > ANY (SELECT price FROM products WHERE id < 3)`；`support: 'partial'`

### Task 6 — 写 Section 4：集合运算（UNION / INTERSECT / EXCEPT）

- **定义段要点**：把两个结果集合并 / `UNION` 并集去重、`UNION ALL` 不去重 / `INTERSECT` 交集 / `EXCEPT` 差集 / 各列数和类型必须对齐
- **语法骨架**：ASCII，三种运算各一行
- **mermaid**：不加
- **Examples**：
  - `union-all-vs-union` — 同一 SELECT 用 UNION 和 UNION ALL 看条数差异；`support: 'partial'`
  - `intersect-customers-buying-A-and-B` — 同时买过 product 1 和 product 2 的客户 = product1 buyers INTERSECT product2 buyers；`support: 'partial'`
  - `except-customers-no-orders` — 全客户 EXCEPT 下过单的客户；`support: 'partial'`

### Task 7 — 写 Section 5：CTE（WITH）与递归 CTE

- **定义段要点**：`WITH <name> AS (...)` 定义命名子查询 / 提高可读性、避免重复 / `WITH RECURSIVE` 递归引用自身（典型用于树形数据 / 数字序列）
- **语法骨架**：ASCII，普通 CTE + RECURSIVE CTE 两种
- **mermaid**：加。画 RECURSIVE CTE 的「锚点 + 递归项 + UNION ALL」三段结构
- **Examples**：
  - `cte-basic` — `WITH big_orders AS (SELECT ... WHERE qty > 5) SELECT count(*) FROM big_orders`；`support: 'partial'`
  - `cte-recursive-series` — `WITH RECURSIVE s(n) AS (SELECT 1 UNION ALL SELECT n + 1 FROM s WHERE n < 10) SELECT * FROM s`；`support: 'partial'`

### Task 8 — 写 Section 6：窗口函数

- **定义段要点**：窗口函数 = 按某窗口聚合但**不折叠行** / `OVER (PARTITION BY ... ORDER BY ...)` 定义窗口 / 常见：ROW_NUMBER / RANK / DENSE_RANK / LAG / LEAD / 累计 SUM
- **语法骨架**：ASCII，`<func>() OVER (PARTITION BY <p> ORDER BY <o>)`
- **mermaid**：加。画「PARTITION BY → ORDER BY → frame」三步结构
- **Examples**：
  - `window-row-number` — 每客户的订单按时间排序 + ROW_NUMBER；`support: 'partial'`
  - `window-rank-dense` — 按 total 排名，演示 RANK 和 DENSE_RANK 在并列时的差异；`support: 'partial'`
  - `window-lag-diff` — 用 LAG 算每客户两次相邻下单的时间差；`support: 'partial'`
  - `window-running-sum` — `SUM(qty * price) OVER (PARTITION BY customer_id ORDER BY ordered_at)` 累计销售；`support: 'partial'`

### Task 9 — 写 `index.ts`

`examples` 数组约 22 个，按 index.md 出现顺序。

### Task 10 — 注册到 `registry.ts`

## 完成验收 Checklist

### 内容边界
- [ ] 6 个 Section 主语依次为：JOIN、子查询、EXISTS/IN/ANY/ALL、集合运算、CTE、窗口函数
- [ ] LATERAL 只在 JOIN 一节给一个 example
- [ ] 未展开 JOIN 算法 / CTE 优化栅栏 / 窗口函数性能（指向 ch17）
- [ ] Section 1、5、6 用 mermaid，label 无裸 `<` `>` `|`

### Schema / Seed
- [ ] 三表 + FK 关系正确
- [ ] orders 25 行覆盖多种 customer × product 组合
- [ ] 至少 1 个 customer 完全没下单（撑 `join-left-find-no-orders`）

### 关键 Example 行为
- [ ] `join-left-find-no-orders` 返回 ≥ 1 行
- [ ] `cte-recursive-series` 返回 10 行（n = 1..10）
- [ ] `window-rank-dense` 在并列情况下 RANK 跳号、DENSE_RANK 不跳号
