-- m_monitoring schema 的前置状态
-- search_path 在执行前已被设置为 m_monitoring, pg_catalog。
--
-- probe 表仅用于产生少量表 / 索引活动，让 pg_stat_user_tables / pg_stat_user_indexes
-- 在本 schema 下有可观测的非零数据。

CREATE TABLE probe (
  id  serial PRIMARY KEY,
  val text NOT NULL
);

INSERT INTO probe (val)
SELECT 'row-' || g
FROM generate_series(1, 100) AS g;

-- 触发一次表扫和一次索引扫，让对应统计视图有非零计数
SELECT count(*) FROM probe;
SELECT count(*) FROM probe WHERE id = 1;

SELECT setval(pg_get_serial_sequence('probe', 'id'), (SELECT max(id) FROM probe));
