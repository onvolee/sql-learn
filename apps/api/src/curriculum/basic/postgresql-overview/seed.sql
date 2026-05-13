-- m_postgresql_overview schema 的前置状态
-- ensure() 端点首次创建 schema 后会执行本文件。
-- search_path 在执行前已被设置为 m_postgresql_overview, pg_catalog，所以下面的 SQL 不需要写完整 schema 限定。

CREATE TABLE items (
  id   serial PRIMARY KEY,
  name text NOT NULL,
  tags text[],
  data jsonb
);

INSERT INTO items (id, name, tags, data) VALUES
  (1, 'laptop',   ARRAY['electronics', 'portable'], '{"brand": "Lenovo", "stock": 12}'::jsonb),
  (2, 'notebook', ARRAY['stationery'],              NULL),
  (3, 'mug',      ARRAY[]::text[],                  '{"brand": "Muji", "color": "white"}'::jsonb),
  (4, 'pen',      NULL,                             NULL)
ON CONFLICT (id) DO NOTHING;

-- 让 serial 序列跨过显式 id，避免后续 example 用默认 nextval 撞主键
SELECT setval(pg_get_serial_sequence('items', 'id'), (SELECT max(id) FROM items));
