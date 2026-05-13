-- m_advanced_types schema 的前置状态
-- ensure() 端点首次创建 schema 后会执行本文件。
-- search_path 在执行前已被设置为 m_advanced_types, pg_catalog，所以下面的 SQL 不需要写完整 schema 限定。

-- DOMAIN：PG 没有 CREATE DOMAIN IF NOT EXISTS，用 DO 块按 pg_type 检测后再建。
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_type t
    JOIN pg_namespace n ON n.oid = t.typnamespace
    WHERE t.typname = 'email_t' AND n.nspname = 'm_advanced_types'
  ) THEN
    CREATE DOMAIN email_t AS text CHECK (VALUE ~ '^[^@]+@[^@]+$');
  END IF;
END $$;

-- ENUM：同理 DO 块包一层。
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_type t
    JOIN pg_namespace n ON n.oid = t.typnamespace
    WHERE t.typname = 'color_t' AND n.nspname = 'm_advanced_types'
  ) THEN
    CREATE TYPE color_t AS ENUM ('red', 'green', 'blue');
  END IF;
END $$;

CREATE TABLE users (
  id        serial PRIMARY KEY,
  name      text NOT NULL,
  age       integer NOT NULL,
  age_group text GENERATED ALWAYS AS (
    CASE
      WHEN age < 18 THEN 'minor'
      WHEN age < 60 THEN 'adult'
      ELSE 'senior'
    END
  ) STORED,
  tags      text[] NOT NULL DEFAULT '{}'
);

CREATE TABLE bookings (
  id     serial PRIMARY KEY,
  room   text NOT NULL,
  during tstzrange NOT NULL
);

INSERT INTO users (id, name, age, tags) VALUES
  (1, 'alice',  12, ARRAY['student']),
  (2, 'bob',    25, ARRAY['admin', 'beta']),
  (3, 'carol',  34, ARRAY['beta']),
  (4, 'dave',   45, ARRAY['admin']),
  (5, 'erin',   58, ARRAY[]::text[]),
  (6, 'frank',  72, ARRAY['vip', 'admin'])
ON CONFLICT (id) DO NOTHING;

-- bookings：room='A' 内三段相邻不重叠；room='B' 两段故意重叠，用于 range-overlap example。
INSERT INTO bookings (id, room, during) VALUES
  (1, 'A', tstzrange('2026-05-12 09:00+00', '2026-05-12 10:00+00', '[)')),
  (2, 'A', tstzrange('2026-05-12 10:00+00', '2026-05-12 11:00+00', '[)')),
  (3, 'A', tstzrange('2026-05-12 14:00+00', '2026-05-12 15:00+00', '[)')),
  (4, 'B', tstzrange('2026-05-12 09:30+00', '2026-05-12 10:30+00', '[)')),
  (5, 'B', tstzrange('2026-05-12 10:00+00', '2026-05-12 11:00+00', '[)'))
ON CONFLICT (id) DO NOTHING;

SELECT setval(pg_get_serial_sequence('users',    'id'), (SELECT max(id) FROM users));
SELECT setval(pg_get_serial_sequence('bookings', 'id'), (SELECT max(id) FROM bookings));
