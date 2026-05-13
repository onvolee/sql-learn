-- m_index schema 的前置状态
-- ensure() 端点首次创建 schema 后会执行本文件。
-- search_path 在执行前已被设置为 m_index, pg_catalog，所以下面的 SQL 不需要写完整 schema 限定。

CREATE TABLE events (
  id      bigserial PRIMARY KEY,
  ts      timestamptz NOT NULL,
  kind    text        NOT NULL,
  payload jsonb       NOT NULL,
  tags    text[]      NOT NULL
);

CREATE TABLE places (
  id       serial PRIMARY KEY,
  name     text NOT NULL,
  location text NOT NULL
);

-- 1 万行 events：ts 横跨过去一年，kind 取 5 种值，payload 含 user_id + amount，tags 随机 2-3 个标签
INSERT INTO events (ts, kind, payload, tags)
SELECT
  now() - (random() * interval '365 days'),
  (ARRAY['click', 'view', 'login', 'purchase', 'error'])[1 + floor(random() * 5)::int],
  jsonb_build_object(
    'user_id', 1 + floor(random() * 1000)::int,
    'amount',  round((random() * 1000)::numeric, 2)
  ),
  (
    SELECT array_agg(t)
    FROM (
      SELECT (ARRAY['web', 'mobile', 'beta', 'vip', 'guest', 'eu', 'us', 'asia'])[1 + floor(random() * 8)::int] AS t
      FROM generate_series(1, 2 + floor(random() * 2)::int)
    ) sub
  )
FROM generate_series(1, 10000);

-- 50 行 places
INSERT INTO places (name, location)
SELECT
  'place_' || g,
  'lat=' || round((random() * 180 - 90)::numeric, 4) || ',lon=' || round((random() * 360 - 180)::numeric, 4)
FROM generate_series(1, 50) g;

-- 统计信息让计划器拿到准确的行估算
ANALYZE events;
ANALYZE places;
