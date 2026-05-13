-- m_jsonb schema 的前置状态
-- ensure() 端点首次创建 schema 后会执行本文件。
-- search_path 在执行前已被设置为 m_jsonb, pg_catalog，所以下面的 SQL 不需要写完整 schema 限定。

CREATE TABLE docs (
  id    serial PRIMARY KEY,
  title text  NOT NULL,
  body  jsonb NOT NULL
);

INSERT INTO docs (id, title, body) VALUES
  (1, 'Intro to SQL',
   '{
      "author": {"name": "alice", "country": "UK"},
      "tags": ["sql", "intro", "select"],
      "stats": {"views": 1024, "likes": 88},
      "published": true
    }'::jsonb),
  (2, 'Indexes in PostgreSQL',
   '{
      "author": {"name": "bob", "country": "US"},
      "tags": ["sql", "index", "performance"],
      "stats": {"views": 540, "likes": 31},
      "published": true
    }'::jsonb),
  (3, 'Window Functions',
   '{
      "author": {"name": "carol", "country": "FR"},
      "tags": ["sql", "window", "advanced"],
      "stats": {"views": 312, "likes": 17},
      "published": false
    }'::jsonb),
  (4, 'JSONB in Practice',
   '{
      "author": {"name": "dave", "country": "DE"},
      "tags": ["sql", "jsonb", "schema-less"],
      "stats": {"views": 2048, "likes": 201},
      "published": true
    }'::jsonb),
  (5, 'Transactions Demystified',
   '{
      "author": {"name": "eve", "country": "JP"},
      "tags": ["transaction", "mvcc"],
      "stats": {"views": 173, "likes": 9},
      "published": false
    }'::jsonb),
  (6, 'Replication Setup',
   '{
      "author": {"name": "frank", "country": "US"},
      "tags": ["replication", "ops"],
      "stats": {"views": 88, "likes": 4},
      "published": true
    }'::jsonb),
  (7, 'VACUUM and Bloat',
   '{
      "author": {"name": "grace", "country": "CA"},
      "tags": ["vacuum", "ops", "performance"],
      "stats": {"views": 421, "likes": 28},
      "published": true
    }'::jsonb),
  (8, 'Logical Backup',
   '{
      "author": {"name": "heidi", "country": "DE"},
      "tags": ["backup", "ops"],
      "stats": {"views": 64, "likes": 3},
      "published": false
    }'::jsonb)
ON CONFLICT (id) DO NOTHING;

-- 让 serial 序列跨过显式 id，避免后续 example 用默认 nextval 撞主键
SELECT setval(pg_get_serial_sequence('docs', 'id'), (SELECT max(id) FROM docs));
