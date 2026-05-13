-- m_performance schema 的前置状态
-- ensure() 端点首次创建 schema 后会执行本文件。
-- search_path 在执行前已被设置为 m_performance, pg_catalog，所以下面的 SQL 不需要写完整 schema 限定。

CREATE TABLE customers (
  id     serial PRIMARY KEY,
  name   text NOT NULL,
  region text NOT NULL
);

CREATE TABLE orders (
  id          bigserial PRIMARY KEY,
  customer_id integer       NOT NULL,
  status      text          NOT NULL,
  total       numeric(10,2) NOT NULL,
  created_at  timestamptz   NOT NULL DEFAULT now()
);

-- 1000 名 customers，region 5 种
INSERT INTO customers (id, name, region)
SELECT
  g,
  'cust_' || g,
  (ARRAY['us', 'eu', 'asia', 'latam', 'africa'])[1 + ((g - 1) % 5)]
FROM generate_series(1, 1000) g
ON CONFLICT (id) DO NOTHING;

-- 10 万行 orders，customer_id 1..1000，status 3 种，日期跨过去 1 年
INSERT INTO orders (customer_id, status, total, created_at)
SELECT
  1 + floor(random() * 1000)::int,
  (ARRAY['pending', 'paid', 'shipped'])[1 + floor(random() * 3)::int],
  round((random() * 1000)::numeric, 2),
  now() - (random() * interval '365 days')
FROM generate_series(1, 100000);

-- 让 serial / bigserial 序列跨过显式 id，避免后续 INSERT 撞主键
SELECT setval(pg_get_serial_sequence('customers', 'id'), (SELECT max(id) FROM customers));

-- 统计信息让 planner 拿到准确的行估算
ANALYZE customers;
ANALYZE orders;
