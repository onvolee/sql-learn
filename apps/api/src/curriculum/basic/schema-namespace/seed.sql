-- m_schema_namespace schema 的前置状态
-- ensure() 端点首次创建 schema 后会执行本文件。
-- search_path 在执行前已被设置为 m_schema_namespace, pg_catalog，所以下面的 SQL 不需要写完整 schema 限定。

CREATE TABLE t1 (
  id  serial PRIMARY KEY,
  val text NOT NULL
);

INSERT INTO t1 (id, val) VALUES
  (1, 'main-a'),
  (2, 'main-b'),
  (3, 'main-c')
ON CONFLICT (id) DO NOTHING;

-- 让 serial 序列跨过显式 id
SELECT setval(pg_get_serial_sequence('t1', 'id'), (SELECT max(id) FROM t1));
