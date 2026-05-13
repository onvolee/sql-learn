-- m_relational_basics schema 的前置状态
-- ensure() 端点首次创建 schema 后会执行本文件。
-- search_path 在执行前已被设置为 m_relational_basics, pg_catalog，所以下面的 SQL 不需要写完整 schema 限定。

CREATE TABLE authors (
  id      serial PRIMARY KEY,
  name    text NOT NULL,
  country text
);

CREATE TABLE books (
  id             serial PRIMARY KEY,
  title          text NOT NULL,
  author_id      integer NOT NULL REFERENCES authors(id),
  published_year integer
);

INSERT INTO authors (id, name, country) VALUES
  (1, 'George Orwell',          'UK'),
  (2, 'Haruki Murakami',        'Japan'),
  (3, 'Gabriel García Márquez', 'Colombia'),
  (4, 'Albert Camus',           'France')
ON CONFLICT (id) DO NOTHING;

INSERT INTO books (id, title, author_id, published_year) VALUES
  (1, '1984',                            1, 1949),
  (2, 'Animal Farm',                     1, 1945),
  (3, 'Norwegian Wood',                  2, 1987),
  (4, 'Kafka on the Shore',              2, 2002),
  (5, '1Q84',                            2, NULL),
  (6, 'One Hundred Years of Solitude',   3, 1967),
  (7, 'Love in the Time of Cholera',     3, 1985),
  (8, 'The Stranger',                    4, 1942)
ON CONFLICT (id) DO NOTHING;

-- 让 serial 序列跨过显式 id，避免后续 example 用默认 nextval 撞主键
SELECT setval(pg_get_serial_sequence('authors', 'id'), (SELECT max(id) FROM authors));
SELECT setval(pg_get_serial_sequence('books',   'id'), (SELECT max(id) FROM books));
