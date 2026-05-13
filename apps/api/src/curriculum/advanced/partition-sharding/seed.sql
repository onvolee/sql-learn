-- m_partition_sharding schema 的前置状态
-- ensure() 端点首次创建 schema 后会执行本文件。
-- search_path 在执行前已被设置为 m_partition_sharding, pg_catalog，所以下面的 SQL 不需要写完整 schema 限定。

-- ───────────────────────────────────────────────
-- RANGE 分区：sales 主表 + 4 个 quarter 子表
-- ───────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS sales (
  id      bigserial,
  region  text          NOT NULL,
  sold_at date          NOT NULL,
  amount  numeric(10,2) NOT NULL
) PARTITION BY RANGE (sold_at);

CREATE TABLE IF NOT EXISTS sales_q1 PARTITION OF sales
  FOR VALUES FROM ('2025-01-01') TO ('2025-04-01');
CREATE TABLE IF NOT EXISTS sales_q2 PARTITION OF sales
  FOR VALUES FROM ('2025-04-01') TO ('2025-07-01');
CREATE TABLE IF NOT EXISTS sales_q3 PARTITION OF sales
  FOR VALUES FROM ('2025-07-01') TO ('2025-10-01');
CREATE TABLE IF NOT EXISTS sales_q4 PARTITION OF sales
  FOR VALUES FROM ('2025-10-01') TO ('2026-01-01');

-- 每 quarter 2000 行，共 8000 行；sold_at 在区间内均匀分布
INSERT INTO sales (region, sold_at, amount)
SELECT
  (ARRAY['east', 'west', 'north', 'south'])[1 + floor(random() * 4)::int],
  date '2025-01-01' + (floor(random() * 90)::int),
  round((random() * 1000)::numeric, 2)
FROM generate_series(1, 2000);

INSERT INTO sales (region, sold_at, amount)
SELECT
  (ARRAY['east', 'west', 'north', 'south'])[1 + floor(random() * 4)::int],
  date '2025-04-01' + (floor(random() * 91)::int),
  round((random() * 1000)::numeric, 2)
FROM generate_series(1, 2000);

INSERT INTO sales (region, sold_at, amount)
SELECT
  (ARRAY['east', 'west', 'north', 'south'])[1 + floor(random() * 4)::int],
  date '2025-07-01' + (floor(random() * 92)::int),
  round((random() * 1000)::numeric, 2)
FROM generate_series(1, 2000);

INSERT INTO sales (region, sold_at, amount)
SELECT
  (ARRAY['east', 'west', 'north', 'south'])[1 + floor(random() * 4)::int],
  date '2025-10-01' + (floor(random() * 92)::int),
  round((random() * 1000)::numeric, 2)
FROM generate_series(1, 2000);

-- ───────────────────────────────────────────────
-- LIST 分区：customers_list 按 region 切
-- ───────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS customers_list (
  id     serial,
  region text NOT NULL,
  name   text NOT NULL
) PARTITION BY LIST (region);

CREATE TABLE IF NOT EXISTS customers_east  PARTITION OF customers_list FOR VALUES IN ('east');
CREATE TABLE IF NOT EXISTS customers_west  PARTITION OF customers_list FOR VALUES IN ('west');
CREATE TABLE IF NOT EXISTS customers_other PARTITION OF customers_list DEFAULT;

-- 60 行：east 20、west 20、其他 region 20（落到 customers_other）
INSERT INTO customers_list (region, name)
SELECT 'east', 'cust_east_' || g FROM generate_series(1, 20) g;

INSERT INTO customers_list (region, name)
SELECT 'west', 'cust_west_' || g FROM generate_series(1, 20) g;

INSERT INTO customers_list (region, name)
SELECT
  (ARRAY['north', 'south', 'central'])[1 + floor(random() * 3)::int],
  'cust_other_' || g
FROM generate_series(1, 20) g;

-- 统计信息让 planner 拿到准确的行估算（影响分区裁剪 EXPLAIN 展示）
ANALYZE sales;
ANALYZE customers_list;
