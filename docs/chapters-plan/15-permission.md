# 章节生成任务：15. 权限与安全

> **Agent 开工前必读**：`docs/chapter-template/chapter-template.md`
> 本文件只提供本章节的具体决策与任务清单。

## 章节基本信息

| 字段 | 值 |
|---|---|
| 大纲来源 | `postgresql-study-outline.md` → 「二、中级阶段 → 7. 权限与安全」 |
| group | `intermediate` |
| slug | `permission` |
| schema | `m_permission` |
| order | 7 |
| 读者画像 | 已会基本 CRUD、知道 schema（→ ch08） |

## 章节特殊性

`/exec` 用固定 role 跑，**不能真切换用户**。本章策略：
- 演示 `CREATE ROLE` / `GRANT` / `REVOKE` 的语句和效果（看 `information_schema.role_table_grants` 验证）
- 用 `SET ROLE` 切换到刚建的 role 内嵌测试一小段（PG 允许同事务内 SET ROLE 到自己创建的 role），然后 `RESET ROLE`
- 不演示密码、登录、`pg_hba.conf`、外部认证

## 教学边界

- 覆盖：role 与 user、GRANT/REVOKE 表级与列级、role 继承、RLS（行级安全）
- 不展开：连接级认证（→ ch21）、SECURITY DEFINER 函数、扩展权限模型

## 任务清单

### Task 1 — 写 `schema.ts`

`reports(id serial PK, owner text NOT NULL, content text NOT NULL, sensitive boolean NOT NULL DEFAULT false)`

### Task 2 — 写 `seed.sql`

`reports` 6 行，含 sensitive=true 的 2 行。

### Task 3 — 写 Section 1：role 与 user

- **定义段要点**：PG 里 role 是统一概念 / `LOGIN` 属性的 role 就是 user / role 可拥有对象、被 GRANT 权限、继承其他 role / `CURRENT_USER` / `SESSION_USER` 区别
- **语法骨架**：ASCII，`CREATE ROLE <name> [LOGIN] [PASSWORD '...']`
- **mermaid**：不加
- **Examples**：
  - `whoami` — `SELECT current_user, session_user, current_role`；`support: 'partial'`
  - `create-temp-role` — `CREATE ROLE IF NOT EXISTS tmp_reader NOLOGIN` + `SELECT rolname FROM pg_roles WHERE rolname = 'tmp_reader'` + 末尾 `DROP ROLE IF EXISTS tmp_reader`；**注意**：建 role 跨事务可见；example 末尾必须 drop（含 cleanup 块）；`support: 'partial'`

### Task 4 — 写 Section 2：GRANT 与 REVOKE

- **定义段要点**：`GRANT <priv> ON <obj> TO <role>` / 表级 priv：SELECT / INSERT / UPDATE / DELETE / TRUNCATE / REFERENCES / TRIGGER / 列级也可 / `WITH GRANT OPTION` 让被授权者再授 / `REVOKE` 反操作
- **语法骨架**：ASCII，`GRANT / REVOKE` 两种基本形式
- **mermaid**：不加
- **Examples**：
  - `grant-select-and-verify` — 建 tmp role → `GRANT SELECT ON reports TO tmp_reader` → 查 `information_schema.role_table_grants WHERE grantee = 'tmp_reader'` → `REVOKE` → 再查 → DROP ROLE；`support: 'partial'`
  - `column-level-grant` — `GRANT SELECT (id, owner) ON reports TO tmp_reader`（不含 sensitive 列）→ 查 `information_schema.column_privileges`；含 cleanup；`support: 'partial'`
  - `set-role-test` — `CREATE ROLE tmp_reader; GRANT SELECT ON reports TO tmp_reader; SET ROLE tmp_reader; SELECT count(*) FROM reports; RESET ROLE; DROP ROLE tmp_reader`；`support: 'partial'`

### Task 5 — 写 Section 3：role 继承

- **定义段要点**：role A 被 `GRANT` 给 role B 后，B 自动获得 A 的权限 / `INHERIT`（默认）属性让 B 直接用 A 的权限，无需 SET ROLE / 群组 role 不开 LOGIN，给真人 role 当容器
- **语法骨架**：ASCII，`GRANT <parent_role> TO <child_role>`
- **mermaid**：加。画 role 树（reader / writer 群组 role + 真人 role 继承）
- **Examples**：
  - `role-inheritance` — `CREATE ROLE tmp_reader_group NOLOGIN; CREATE ROLE tmp_alice NOLOGIN; GRANT SELECT ON reports TO tmp_reader_group; GRANT tmp_reader_group TO tmp_alice; SET ROLE tmp_alice; SELECT count(*) FROM reports; RESET ROLE; DROP ROLE tmp_alice; DROP ROLE tmp_reader_group`；`support: 'partial'`

### Task 6 — 写 Section 4：行级安全（RLS）

- **定义段要点**：`ALTER TABLE ... ENABLE ROW LEVEL SECURITY` 开 RLS / 默认拒绝所有行 / `CREATE POLICY` 定义可见 / 修改条件 / 适合多租户、按用户隔离数据
- **语法骨架**：ASCII，ENABLE + CREATE POLICY 两条
- **mermaid**：不加
- **Examples**：
  - `rls-enable-and-policy` — 建 tmp role + GRANT SELECT + `ALTER TABLE reports ENABLE ROW LEVEL SECURITY` + `CREATE POLICY tmp_only_non_sensitive ON reports FOR SELECT TO tmp_reader USING (NOT sensitive)` + `SET ROLE tmp_reader` + 查 `SELECT count(*) FROM reports`（应少于全量） + RESET + DROP POLICY + DISABLE RLS + DROP ROLE；`support: 'partial'`

### Task 7 — 写 `index.ts`

`examples` 数组约 8 个。

### Task 8 — 注册到 `registry.ts`

## 完成验收 Checklist

### 内容边界
- [ ] 4 个 Section 主语依次为：role 与 user、GRANT/REVOKE、role 继承、RLS
- [ ] 未涉及 pg_hba.conf、认证（→ ch21）、SECURITY DEFINER

### 重入安全（本章 critical）
- [ ] 每个建 role 的 example 末尾**必须** `DROP ROLE IF EXISTS`
- [ ] 每个开 RLS 的 example 末尾**必须** `ALTER TABLE ... DISABLE RLS` + `DROP POLICY IF EXISTS`
- [ ] 每个 SET ROLE 的 example 末尾**必须** `RESET ROLE`
- [ ] 失败重跑不留遗留对象（建议每个 example 开头先 DROP IF EXISTS）

### 关键 Example 行为
- [ ] `grant-select-and-verify` 在 grant 之后 role_table_grants 多一行，revoke 之后又少一行
- [ ] `rls-enable-and-policy` 在 SET ROLE 后查到的行数 < 全量行数
