-- m_sql_syntax schema 的前置状态
-- ensure() 端点首次创建 schema 后会执行本文件。
-- search_path 在执行前已被设置为 m_sql_syntax, pg_catalog，所以下面的 SQL 不需要写完整 schema 限定。

CREATE TABLE employees (
  id     serial PRIMARY KEY,
  name   text NOT NULL,
  dept   text NOT NULL,
  salary numeric(10, 2) NOT NULL
);

INSERT INTO employees (id, name, dept, salary) VALUES
  (1,  'alice',   'engineering', 8500.00),
  (2,  'bob',     'engineering', 9200.00),
  (3,  'carol',   'engineering', 7800.00),
  (4,  'david',   'engineering', 10500.00),
  (5,  'eve',     'sales',       6200.00),
  (6,  'frank',   'sales',       5800.00),
  (7,  'grace',   'sales',       6500.00),
  (8,  'henry',   'hr',          4800.00),
  (9,  'iris',    'hr',          5100.00),
  (10, 'jack',    'hr',          4500.00)
ON CONFLICT (id) DO NOTHING;

-- 让 serial 序列跨过显式 id，避免后续 example 用默认 nextval 撞主键
SELECT setval(pg_get_serial_sequence('employees', 'id'), (SELECT max(id) FROM employees));
