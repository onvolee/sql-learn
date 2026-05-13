-- 首次启动 PG 时自动执行：创建非超管 app 角色给后端使用
-- 决策见 docs/adr/0002-module-isolation-via-search-path.md

CREATE ROLE app WITH LOGIN PASSWORD 'app';

GRANT CREATE, USAGE ON SCHEMA public TO app;
GRANT CREATE ON DATABASE sqllearn TO app;

ALTER DEFAULT PRIVILEGES FOR ROLE app
  GRANT ALL ON TABLES TO app;
ALTER DEFAULT PRIVILEGES FOR ROLE app
  GRANT ALL ON SEQUENCES TO app;
