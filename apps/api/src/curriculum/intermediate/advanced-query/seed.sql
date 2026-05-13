-- m_advanced_query schema 的前置状态
-- ensure() 端点首次创建 schema 后会执行本文件。
-- search_path 在执行前已被设置为 m_advanced_query, pg_catalog，所以下面的 SQL 不需要写完整 schema 限定。

CREATE TABLE customers (
  id     serial PRIMARY KEY,
  name   text NOT NULL,
  region text NOT NULL
);

CREATE TABLE products (
  id    serial PRIMARY KEY,
  name  text NOT NULL,
  price numeric(10, 2) NOT NULL
);

CREATE TABLE orders (
  id          serial PRIMARY KEY,
  customer_id integer NOT NULL REFERENCES customers(id),
  product_id  integer NOT NULL REFERENCES products(id),
  qty         integer NOT NULL,
  ordered_at  timestamptz NOT NULL DEFAULT now()
);

INSERT INTO customers (id, name, region) VALUES
  (1, 'Alice', 'North'),
  (2, 'Bob',   'North'),
  (3, 'Carol', 'South'),
  (4, 'Dave',  'South'),
  (5, 'Eve',   'East'),
  (6, 'Frank', 'East')   -- Frank 完全没下单
ON CONFLICT (id) DO NOTHING;

INSERT INTO products (id, name, price) VALUES
  (1, 'Pen',     10.00),
  (2, 'Mug',     50.00),
  (3, 'Lamp',   200.00),
  (4, 'Chair',  500.00),
  (5, 'Desk',  1000.00)
ON CONFLICT (id) DO NOTHING;

-- 25 orders，5 个客户（1..5）× 多种 product 组合，固定 ordered_at 让窗口函数结果可复现
INSERT INTO orders (id, customer_id, product_id, qty, ordered_at) VALUES
  ( 1, 1, 1,  3, '2024-01-02 09:00+00'),
  ( 2, 1, 2,  1, '2024-01-05 10:00+00'),
  ( 3, 1, 3,  2, '2024-01-10 11:00+00'),
  ( 4, 1, 5,  1, '2024-02-01 12:00+00'),
  ( 5, 2, 1,  6, '2024-01-03 09:30+00'),
  ( 6, 2, 2,  2, '2024-01-08 10:30+00'),
  ( 7, 2, 4,  1, '2024-02-12 14:00+00'),
  ( 8, 3, 1,  4, '2024-01-04 08:00+00'),
  ( 9, 3, 2,  3, '2024-01-09 09:00+00'),
  (10, 3, 3,  1, '2024-01-15 10:00+00'),
  (11, 3, 4,  2, '2024-02-05 11:00+00'),
  (12, 3, 5,  1, '2024-02-20 12:00+00'),
  (13, 4, 1,  8, '2024-01-06 07:00+00'),
  (14, 4, 3,  1, '2024-01-20 08:00+00'),
  (15, 4, 4,  1, '2024-02-10 09:00+00'),
  (16, 5, 1,  2, '2024-01-07 13:00+00'),
  (17, 5, 2,  4, '2024-01-12 14:00+00'),
  (18, 5, 3,  3, '2024-01-25 15:00+00'),
  (19, 5, 5,  1, '2024-02-18 16:00+00'),
  (20, 1, 4,  2, '2024-02-22 09:00+00'),
  (21, 2, 5,  1, '2024-02-25 10:00+00'),
  (22, 3, 1, 10, '2024-03-01 11:00+00'),
  (23, 4, 2,  6, '2024-03-03 12:00+00'),
  (24, 5, 4,  1, '2024-03-05 13:00+00'),
  (25, 1, 1,  5, '2024-03-10 14:00+00')
ON CONFLICT (id) DO NOTHING;

SELECT setval(pg_get_serial_sequence('customers', 'id'), (SELECT max(id) FROM customers));
SELECT setval(pg_get_serial_sequence('products',  'id'), (SELECT max(id) FROM products));
SELECT setval(pg_get_serial_sequence('orders',    'id'), (SELECT max(id) FROM orders));
