-- m_view_function schema 的前置状态
-- ensure() 端点首次创建 schema 后会执行本文件。
-- search_path 在执行前已被设置为 m_view_function, pg_catalog，所以下面的 SQL 不需要写完整 schema 限定。

CREATE TABLE sales (
  id      serial PRIMARY KEY,
  product text NOT NULL,
  region  text NOT NULL,
  amount  numeric(10, 2) NOT NULL,
  sold_at timestamptz NOT NULL DEFAULT now()
);

INSERT INTO sales (id, product, region, amount, sold_at) VALUES
  ( 1, 'keyboard', 'east',  120.00, '2024-01-05 10:00+00'),
  ( 2, 'mouse',    'east',   45.50, '2024-01-08 11:00+00'),
  ( 3, 'monitor',  'east',  330.00, '2024-02-02 09:30+00'),
  ( 4, 'laptop',   'east', 1280.00, '2024-02-18 14:15+00'),
  ( 5, 'cable',    'east',   12.00, '2024-03-10 08:45+00'),
  ( 6, 'keyboard', 'east',  118.00, '2024-03-22 16:00+00'),
  ( 7, 'mouse',    'east',   48.00, '2024-04-01 12:00+00'),
  ( 8, 'monitor',  'east',  340.00, '2024-04-19 13:30+00'),
  ( 9, 'laptop',   'east', 1310.00, '2024-05-05 10:20+00'),
  (10, 'cable',    'east',   11.50, '2024-05-21 09:00+00'),
  (11, 'keyboard', 'west',  125.00, '2024-01-07 10:00+00'),
  (12, 'mouse',    'west',   47.00, '2024-01-14 11:00+00'),
  (13, 'monitor',  'west',  320.00, '2024-02-09 09:30+00'),
  (14, 'laptop',   'west', 1290.00, '2024-02-25 14:15+00'),
  (15, 'cable',    'west',   13.00, '2024-03-15 08:45+00'),
  (16, 'keyboard', 'west',  130.00, '2024-03-28 16:00+00'),
  (17, 'mouse',    'west',   46.00, '2024-04-06 12:00+00'),
  (18, 'monitor',  'west',  335.00, '2024-04-22 13:30+00'),
  (19, 'laptop',   'west', 1305.00, '2024-05-10 10:20+00'),
  (20, 'cable',    'west',   12.50, '2024-05-25 09:00+00'),
  (21, 'keyboard', 'north', 122.00, '2024-01-11 10:00+00'),
  (22, 'mouse',    'north',  44.00, '2024-01-19 11:00+00'),
  (23, 'monitor',  'north', 325.00, '2024-02-12 09:30+00'),
  (24, 'laptop',   'north',1275.00, '2024-02-27 14:15+00'),
  (25, 'cable',    'north',  12.80, '2024-03-18 08:45+00'),
  (26, 'keyboard', 'north', 119.00, '2024-03-30 16:00+00'),
  (27, 'mouse',    'north',  47.50, '2024-04-09 12:00+00'),
  (28, 'monitor',  'north', 332.00, '2024-04-25 13:30+00'),
  (29, 'laptop',   'north',1295.00, '2024-05-12 10:20+00'),
  (30, 'cable',    'north',  12.20, '2024-05-28 09:00+00')
ON CONFLICT (id) DO NOTHING;

-- 让 serial 序列跨过显式 id
SELECT setval(pg_get_serial_sequence('sales', 'id'), (SELECT max(id) FROM sales));

-- 普通视图：按 region 汇总销售额
CREATE OR REPLACE VIEW v_region_total AS
SELECT region, sum(amount) AS total_amount, count(*) AS sale_count
FROM sales
GROUP BY region;

-- 物化视图：与 v_region_total 同语义，但存的是结果集
CREATE MATERIALIZED VIEW IF NOT EXISTS mv_region_total AS
SELECT region, sum(amount) AS total_amount, count(*) AS sale_count
FROM sales
GROUP BY region;

-- PL/pgSQL 函数：返回某 region 的销售总额
CREATE OR REPLACE FUNCTION fn_region_total(r text)
RETURNS numeric
LANGUAGE plpgsql
AS $$
DECLARE
  total numeric;
BEGIN
  SELECT sum(amount) INTO total
  FROM sales
  WHERE region = r;
  RETURN coalesce(total, 0);
END;
$$;

-- 审计表 + BEFORE INSERT 触发器：插入 sales 时同时往 audit 写一行
CREATE TABLE IF NOT EXISTS sales_audit (
  id          serial PRIMARY KEY,
  sale_id     integer,
  product     text,
  region      text,
  amount      numeric(10, 2),
  inserted_at timestamptz NOT NULL DEFAULT now()
);

CREATE OR REPLACE FUNCTION fn_sales_audit()
RETURNS trigger
LANGUAGE plpgsql
AS $$
BEGIN
  INSERT INTO sales_audit (sale_id, product, region, amount)
  VALUES (NEW.id, NEW.product, NEW.region, NEW.amount);
  RETURN NEW;
END;
$$;

DROP TRIGGER IF EXISTS trg_sales_audit ON sales;
CREATE TRIGGER trg_sales_audit
BEFORE INSERT ON sales
FOR EACH ROW
EXECUTE FUNCTION fn_sales_audit();
