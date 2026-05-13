-- m_full_text_search schema 的前置状态
-- ensure() 端点首次创建 schema 后会执行本文件。
-- search_path 在执行前已被设置为 m_full_text_search, pg_catalog，所以下面的 SQL 不需要写完整 schema 限定。

CREATE TABLE articles (
  id    serial PRIMARY KEY,
  title text NOT NULL,
  body  text NOT NULL,
  lang  text NOT NULL DEFAULT 'english',
  -- GENERATED tsvector 列：插入/更新 title/body 时自动重算切词结果。
  -- 实战做法的关键一步——把切词结果物化到表里，搜索时 WHERE tsv @@ to_tsquery(...) 走 GIN 索引。
  tsv   tsvector GENERATED ALWAYS AS (
          to_tsvector('english', coalesce(title, '') || ' ' || coalesce(body, ''))
        ) STORED
);

INSERT INTO articles (id, title, body, lang) VALUES
  (1,
   'Getting Started with PostgreSQL',
   'PostgreSQL is a powerful open source relational database. It supports SQL standard features and many extensions. This article shows how to install postgres and run the first query against a sample database.',
   'english'),
  (2,
   'Understanding B-tree Indexes in Postgres',
   'A B-tree index is the default index type in PostgreSQL. It speeds up equality and range queries on ordered data. Without an index the database performs a sequential scan, reading every row from disk.',
   'english'),
  (3,
   'When a Sequential Scan Beats an Index',
   'Indexes are not always faster. For small tables a sequential scan can win because random IO and index traversal add overhead. The planner uses statistics to choose between seq scan and index scan.',
   'english'),
  (4,
   'JSONB vs JSON in PostgreSQL',
   'JSONB stores parsed binary JSON and supports indexing through GIN. The plain JSON type keeps the original text. For querying nested fields JSONB is usually the right choice in postgres.',
   'english'),
  (5,
   'Full Text Search Basics',
   'PostgreSQL ships with built in full text search. It converts documents into tsvector and queries into tsquery. The @@ operator returns true when the document matches the query. A GIN index on tsvector makes the search fast.',
   'english'),
  (6,
   'Transactions and MVCC',
   'PostgreSQL implements MVCC so readers do not block writers. Each row has a visibility window expressed by xmin and xmax. Long running transactions can prevent vacuum from cleaning up dead tuples and bloat the index.',
   'english'),
  (7,
   'GIN vs GiST Indexes',
   'GIN indexes are inverted indexes ideal for sets of values such as tsvector and jsonb keys. GiST indexes are more general and support geometric data. For full text search GIN on tsvector is the common default.',
   'english'),
  (8,
   'Tuning Autovacuum on a Busy Table',
   'When a table sees heavy update traffic autovacuum may lag behind. Tune autovacuum_vacuum_scale_factor on a per table basis. Without timely vacuum the index bloats and seq scan becomes unavoidable.',
   'english')
ON CONFLICT (id) DO NOTHING;

-- 让 serial 序列跨过显式 id，避免后续 example 用默认 nextval 撞主键。
SELECT setval(pg_get_serial_sequence('articles', 'id'), (SELECT max(id) FROM articles));
