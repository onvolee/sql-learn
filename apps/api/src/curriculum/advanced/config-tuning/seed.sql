-- m_config_tuning schema 的前置状态
-- ensure() 端点首次创建 schema 后会执行本文件。
-- search_path 在执行前已被设置为 m_config_tuning, pg_catalog，所以下面的 SQL 不需要写完整 schema 限定。

CREATE TABLE probe (
  id  serial PRIMARY KEY,
  val text NOT NULL
);

INSERT INTO probe (id, val) VALUES
  (1, 'alpha'),
  (2, 'bravo'),
  (3, 'charlie'),
  (4, 'delta'),
  (5, 'echo')
ON CONFLICT (id) DO NOTHING;

SELECT setval(pg_get_serial_sequence('probe', 'id'), (SELECT max(id) FROM probe));
