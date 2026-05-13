-- m_transaction schema 的前置状态
-- ensure() 端点首次创建 schema 后会执行本文件。
-- search_path 在执行前已被设置为 m_transaction, pg_catalog，所以下面的 SQL 不需要写完整 schema 限定。

CREATE TABLE accounts (
  id      serial PRIMARY KEY,
  owner   text NOT NULL,
  balance numeric(10, 2) NOT NULL DEFAULT 0 CHECK (balance >= 0)
);

INSERT INTO accounts (id, owner, balance) VALUES
  (1, 'Alice', 1000),
  (2, 'Bob',   1000),
  (3, 'Carol',  100),
  (4, 'Dave',     0)
ON CONFLICT (id) DO NOTHING;

-- 让 serial 序列跨过显式 id，避免后续 example 用默认 nextval 撞主键
SELECT setval(pg_get_serial_sequence('accounts', 'id'), (SELECT max(id) FROM accounts));
