-- m_permission schema 的前置状态
-- ensure() 端点首次创建 schema 后会执行本文件。
-- search_path 在执行前已被设置为 m_permission, pg_catalog，所以下面的 SQL 不需要写完整 schema 限定。

CREATE TABLE reports (
  id        serial PRIMARY KEY,
  owner     text NOT NULL,
  content   text NOT NULL,
  sensitive boolean NOT NULL DEFAULT false
);

INSERT INTO reports (id, owner, content, sensitive) VALUES
  (1, 'alice', 'Q1 sales summary',          false),
  (2, 'alice', 'Q2 sales summary',          false),
  (3, 'bob',   'team morale notes',         false),
  (4, 'bob',   'public roadmap draft',      false),
  (5, 'alice', 'internal salary review',    true),
  (6, 'carol', 'security incident postmortem', true)
ON CONFLICT (id) DO NOTHING;

-- 让 serial 序列跨过显式 id，避免后续 example 用默认 nextval 撞主键
SELECT setval(pg_get_serial_sequence('reports', 'id'), (SELECT max(id) FROM reports));
