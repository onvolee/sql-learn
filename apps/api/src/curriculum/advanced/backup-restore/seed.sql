-- m_backup_restore schema 的前置状态
-- ensure() 端点首次创建 schema 后会执行本文件。
-- search_path 在执行前已被设置为 m_backup_restore, pg_catalog，所以下面的 SQL 不需要写完整 schema 限定。

CREATE TABLE orders (
  id       serial PRIMARY KEY,
  customer text NOT NULL,
  amount   numeric(10, 2) NOT NULL
);

INSERT INTO orders (id, customer, amount)
SELECT
  g                                              AS id,
  'cust-' || lpad((((g - 1) % 20) + 1)::text, 2, '0')  AS customer,
  round((100 + (g * 37) % 9000)::numeric / 100, 2)     AS amount
FROM generate_series(1, 100) AS g
ON CONFLICT (id) DO NOTHING;

-- 让 serial 序列跨过显式 id，避免后续 example 用默认 nextval 撞主键
SELECT setval(pg_get_serial_sequence('orders', 'id'), (SELECT max(id) FROM orders));
