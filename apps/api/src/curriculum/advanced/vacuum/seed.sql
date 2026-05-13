-- m_vacuum schema 的前置状态
-- ensure() 端点首次创建 schema 后会执行本文件。
-- search_path 在执行前已被设置为 m_vacuum, pg_catalog，所以下面的 SQL 不需要写完整 schema 限定。

CREATE TABLE bloat_demo (
  id      serial PRIMARY KEY,
  payload text NOT NULL
);

-- 1 万行，每行 200 字节 payload，让物理体积明显（约 2MB+ 表数据）
INSERT INTO bloat_demo (id, payload)
SELECT g, repeat('x', 200)
FROM generate_series(1, 10000) AS g
ON CONFLICT (id) DO NOTHING;

SELECT setval(pg_get_serial_sequence('bloat_demo', 'id'), (SELECT max(id) FROM bloat_demo));

-- 让 pg_stat_user_tables 立刻有数据可看（ANALYZE 不能在事务里跑 VACUUM，但 ANALYZE 自身可以）
ANALYZE bloat_demo;
