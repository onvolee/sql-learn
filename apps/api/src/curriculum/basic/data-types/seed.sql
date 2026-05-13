-- m_data_types schema 的前置状态
-- ensure() 端点首次创建 schema 后会执行本文件。
-- search_path 在执行前已被设置为 m_data_types, pg_catalog，所以下面的 SQL 不需要写完整 schema 限定。

CREATE TABLE samples (
  id          serial PRIMARY KEY,
  n_int       integer,
  n_big       bigint,
  n_num       numeric(10, 4),
  n_real      real,
  s_text      text,
  s_varchar   varchar(10),
  s_char      char(5),
  t_date      date,
  t_ts        timestamp,
  t_tstz      timestamptz,
  t_interval  interval,
  b_bool      boolean,
  u_uuid      uuid,
  j_jsonb     jsonb,
  a_arr       text[]
);

INSERT INTO samples (
  id, n_int, n_big, n_num, n_real,
  s_text, s_varchar, s_char,
  t_date, t_ts, t_tstz, t_interval,
  b_bool, u_uuid, j_jsonb, a_arr
) VALUES
  (1, 1,    100, 1.2345,  0.1,
   'hello', 'short',  'ab',
   '2026-01-01', '2026-01-01 12:00:00', '2026-01-01 12:00:00+00', interval '1 day',
   true,  '11111111-1111-1111-1111-111111111111'::uuid,
   '{"k": 1}'::jsonb,         ARRAY['a','b']),
  (2, 42,   9000000000, 99.9999, 3.14,
   'world', 'ten chars!', 'xy',
   '2026-02-14', '2026-02-14 08:30:00', '2026-02-14 08:30:00+09', interval '2 hours',
   false, '22222222-2222-2222-2222-222222222222'::uuid,
   '{"k": 2, "tags": ["x"]}'::jsonb, ARRAY['c']),
  (3, NULL, NULL, NULL, NULL,
   NULL, NULL, NULL,
   NULL, NULL, NULL, NULL,
   NULL, NULL, NULL, NULL),
  (4, -1,  -1, -3.5, -0.5,
   'multi-byte 中文', 'abc',     'pad',
   '1970-01-01', '1970-01-01 00:00:00', '1970-01-01 00:00:00+00', interval '90 minutes',
   true,  '33333333-3333-3333-3333-333333333333'::uuid,
   '{"nested": {"a": 1}}'::jsonb, ARRAY['x','y','z']),
  (5, 2147483647, 9223372036854775807, 9.9999, 1e10,
   'edge values', 'maxlen 10', 'big',
   '9999-12-31', '9999-12-31 23:59:59', '9999-12-31 23:59:59+00', interval '1 year 2 months',
   NULL, '44444444-4444-4444-4444-444444444444'::uuid,
   '[]'::jsonb,                ARRAY[]::text[])
ON CONFLICT (id) DO NOTHING;

SELECT setval(pg_get_serial_sequence('samples', 'id'), (SELECT max(id) FROM samples));
