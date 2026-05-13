-- m_extensions schema 的前置状态
-- search_path 已被设为 m_extensions, pg_catalog，下面 SQL 不写完整 schema 限定。

CREATE TABLE probe (
  id  serial PRIMARY KEY,
  val text   NOT NULL
);

INSERT INTO probe (id, val) VALUES
  (1, 'hello'),
  (2, 'helo'),
  (3, 'world'),
  (4, 'word'),
  (5, 'postgres')
ON CONFLICT (id) DO NOTHING;

SELECT setval(pg_get_serial_sequence('probe', 'id'), (SELECT max(id) FROM probe));
