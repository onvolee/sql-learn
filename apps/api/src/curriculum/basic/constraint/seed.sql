-- m_constraint schema 的前置状态
-- ensure() 端点首次创建 schema 后会执行本文件。
-- search_path 在执行前已被设置为 m_constraint, pg_catalog，所以下面的 SQL 不需要写完整 schema 限定。

CREATE TABLE orders (
  id       serial PRIMARY KEY,
  customer text NOT NULL,
  status   text NOT NULL DEFAULT 'pending',
  total    numeric(10, 2) CONSTRAINT orders_total_non_negative CHECK (total >= 0)
);

CREATE TABLE order_items (
  order_id integer NOT NULL REFERENCES orders(id) ON DELETE CASCADE,
  line_no  integer NOT NULL,
  product  text NOT NULL,
  qty      integer NOT NULL CONSTRAINT order_items_qty_positive CHECK (qty > 0),
  PRIMARY KEY (order_id, line_no)
);

INSERT INTO orders (id, customer, status, total) VALUES
  (1, 'alice', 'paid',     120.50),
  (2, 'bob',   'pending',  0.00),
  (3, 'carol', 'paid',     59.90),
  (4, 'dave',  'pending',  240.00)
ON CONFLICT (id) DO NOTHING;

INSERT INTO order_items (order_id, line_no, product, qty) VALUES
  (1, 1, 'book',     2),
  (1, 2, 'pen',      5),
  (2, 1, 'notebook', 1),
  (3, 1, 'lamp',     1),
  (3, 2, 'bulb',     3),
  (4, 1, 'chair',    2),
  (4, 2, 'desk',     1),
  (4, 3, 'mat',      1)
ON CONFLICT (order_id, line_no) DO NOTHING;

-- 让 serial 序列跨过显式 id，避免后续 example 用默认 nextval 撞主键
SELECT setval(pg_get_serial_sequence('orders', 'id'), (SELECT max(id) FROM orders));
