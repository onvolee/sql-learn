# 章节生成任务：12. 视图与函数

> **Agent 开工前必读**：`docs/chapter-template/chapter-template.md`
> 本文件只提供本章节的具体决策与任务清单。

## 章节基本信息

| 字段 | 值 |
|---|---|
| 大纲来源 | `postgresql-study-outline.md` → 「二、中级阶段 → 4. 视图与函数」 |
| group | `intermediate` |
| slug | `view-function` |
| schema | `m_view_function` |
| order | 4 |
| 读者画像 | 已熟悉 JOIN、子查询、GROUP BY（→ ch09） |

## 教学边界

- 覆盖：普通视图、物化视图、PL/pgSQL 函数、触发器、事件触发器（点到为止）
- 不展开：函数权限模型（→ ch15）、物化视图的并发刷新调优（→ ch17）

## 任务清单

### Task 1 — 写 `schema.ts`

`sales(id serial PK, product text NOT NULL, region text NOT NULL, amount numeric(10, 2) NOT NULL, sold_at timestamptz NOT NULL DEFAULT now())`

视图 / 物化视图 / 函数 / 触发器都在 seed.sql 里建。

### Task 2 — 写 `seed.sql`

- `sales` 30 行（覆盖 3 region × 5 product × 多个时间段）
- `CREATE OR REPLACE VIEW v_region_total AS ...`
- `CREATE MATERIALIZED VIEW IF NOT EXISTS mv_region_total AS ...`
- `CREATE OR REPLACE FUNCTION fn_region_total(r text) RETURNS numeric AS $$ ... $$ LANGUAGE plpgsql`
- 触发器函数 + 触发器（用 `DROP TRIGGER IF EXISTS` + `CREATE TRIGGER`）

### Task 3 — 写 Section 1：普通视图

- **定义段要点**：视图 = 命名的 SELECT / 不存数据，每次查现算 / 用于封装复杂查询 / `CREATE OR REPLACE VIEW` 重定义
- **语法骨架**：ASCII，`CREATE OR REPLACE VIEW <name> AS SELECT ...`
- **mermaid**：不加
- **Examples**：
  - `view-select` — `SELECT * FROM v_region_total`；`support: 'partial'`
  - `view-replace` — `CREATE OR REPLACE VIEW v_region_total AS ...` 改定义并再次查；`support: 'partial'`（注意：列结构改变会失败，用相同列结构换 ORDER BY 之类的细节）
  - `view-drop-recreate` — `DROP VIEW IF EXISTS v_demo` + `CREATE VIEW v_demo AS ...` + `DROP VIEW v_demo`；`support: 'partial'`

### Task 4 — 写 Section 2：物化视图

- **定义段要点**：物化视图存的是「执行后的结果集」 / 查时不重新计算 / 需要手动 `REFRESH MATERIALIZED VIEW` / `CONCURRENTLY` 不阻塞读但要求 unique index / 适合代价高但变化不频繁的聚合
- **语法骨架**：ASCII，`CREATE MATERIALIZED VIEW ... AS ...` + `REFRESH [CONCURRENTLY]`
- **mermaid**：不加
- **Examples**：
  - `mv-select` — `SELECT * FROM mv_region_total`；`support: 'partial'`
  - `mv-refresh` — `REFRESH MATERIALIZED VIEW mv_region_total`；`support: 'partial'`
  - `mv-refresh-concurrently` — 演示 CONCURRENTLY 失败（无 unique index）然后建索引再成功；`support: 'partial'`（含 cleanup）

### Task 5 — 写 Section 3：函数（PL/pgSQL）

- **定义段要点**：PG 支持多种过程语言，PL/pgSQL 是默认 / `CREATE OR REPLACE FUNCTION` 定义 / 可有参数、返回值、局部变量、控制流 / 调用：`SELECT fn(...)`
- **语法骨架**：mermaid，画 PL/pgSQL 函数体结构（DECLARE / BEGIN / 异常处理 / END）
- **mermaid**：加
- **Examples**：
  - `fn-call` — `SELECT fn_region_total('east')`；`support: 'partial'`
  - `fn-define-inline` — 一个 example 内 `CREATE OR REPLACE FUNCTION` 定义临时函数 + 调用 + `DROP FUNCTION IF EXISTS`；`support: 'partial'`
  - `fn-inspect-source` — `SELECT prosrc FROM pg_proc WHERE proname = 'fn_region_total'`；`support: 'partial'`

### Task 6 — 写 Section 4：触发器

- **定义段要点**：触发器 = 在表上发生事件时自动跑的函数 / 时机：`BEFORE / AFTER / INSTEAD OF` / 事件：`INSERT / UPDATE / DELETE / TRUNCATE` / 粒度：FOR EACH ROW / STATEMENT / 触发器函数返回 NEW / OLD
- **语法骨架**：ASCII，`CREATE TRIGGER <name> BEFORE/AFTER <event> ON <table> FOR EACH ROW EXECUTE FUNCTION <fn>()`
- **mermaid**：加。画事件触发流程：INSERT → BEFORE → 行级处理 → AFTER → COMMIT
- **Examples**：
  - `trigger-audit-on-insert` — 建一个 audit 表 + BEFORE INSERT 触发器 +往 sales 插一行 +看 audit；触发器用 seed 预建；`support: 'partial'`
  - `trigger-inspect` — 查 `information_schema.triggers WHERE trigger_schema = current_schema()`；`support: 'partial'`

### Task 7 — 写 Section 5：事件触发器（点到为止）

- **定义段要点**：事件触发器 = DDL 级触发器（不绑定单表） / 监听 `ddl_command_start` / `ddl_command_end` / `sql_drop` 等 / 用于审计 schema 变更 / 需要 superuser，普通教学场景少用
- **语法骨架**：ASCII，`CREATE EVENT TRIGGER <name> ON <event> EXECUTE FUNCTION <fn>()`
- **mermaid**：不加
- **Examples**：
  - `event-trigger-list` — `SELECT evtname, evtevent FROM pg_event_trigger`（多数库无，返回空也是教学点）；`support: 'partial'`

### Task 8 — 写 `index.ts`

`examples` 数组约 13 个。

### Task 9 — 注册到 `registry.ts`

## 完成验收 Checklist

### 内容边界
- [ ] 5 个 Section 主语依次为：普通视图、物化视图、函数、触发器、事件触发器
- [ ] 函数节用 PL/pgSQL，未引入 PL/python / PL/v8 等其他语言
- [ ] 事件触发器节只点到为止

### Schema / Seed
- [ ] seed 预建 v_region_total、mv_region_total、fn_region_total 及触发器（全部用 `CREATE OR REPLACE` 或 `IF NOT EXISTS`）

### 重入安全
- [ ] 所有 example 临时建对象用 `IF NOT EXISTS` + `DROP ... IF EXISTS`
- [ ] `mv-refresh-concurrently` 中临时建的 unique index 末尾删除

### 关键 Example 行为
- [ ] `fn-call` 返回 numeric 结果
- [ ] `trigger-audit-on-insert` 在 sales 插入后 audit 表多一行
- [ ] `mv-refresh-concurrently` 在无 unique index 时失败
