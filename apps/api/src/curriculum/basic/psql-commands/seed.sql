-- m_psql_commands schema 的前置状态
-- ensure() 端点首次创建 schema 后会执行本文件。
-- search_path 在执行前已被设置为 m_psql_commands, pg_catalog，所以下面的 SQL 不需要写完整 schema 限定。

CREATE TABLE books (
  id     serial PRIMARY KEY,
  title  text NOT NULL,
  author text
);

INSERT INTO books (id, title, author) VALUES
  (1, '1984',           'George Orwell'),
  (2, 'Norwegian Wood', 'Haruki Murakami'),
  (3, 'The Stranger',   'Albert Camus')
ON CONFLICT (id) DO NOTHING;

-- 让 serial 序列跨过显式 id，避免后续 example 用默认 nextval 撞主键
SELECT setval(pg_get_serial_sequence('books', 'id'), (SELECT max(id) FROM books));

-- 示例函数：演示 \df 等价查询能列到它
CREATE OR REPLACE FUNCTION title_upper(b books) RETURNS text AS $$
  SELECT upper(b.title)
$$ LANGUAGE SQL;
