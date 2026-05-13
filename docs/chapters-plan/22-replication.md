# 章节生成任务：22. 复制与高可用

> **Agent 开工前必读**：`docs/chapter-template/chapter-template.md`
> 本文件只提供本章节的具体决策与任务清单。

## 章节基本信息

| 字段 | 值 |
|---|---|
| 大纲来源 | `postgresql-study-outline.md` → 「三、高级阶段 → 6. 复制与高可用」 |
| group | `advanced` |
| slug | `replication` |
| schema | `m_replication` |
| order | 6 |
| 读者画像 | 已会 WAL（→ ch20）、监控（→ ch19） |

## 章节特殊性

复制需要主备两套 PG 实例，**本课程单实例做不出真复制**。本章策略：
- **概念为主**，example 只查与复制相关的系统视图（多数返回空，是教学点）
- 配置参数、命令、流程用语法骨架 + 文字解释，不要求 example 跑通真复制

## 教学边界

- 覆盖：流复制（physical / streaming）、逻辑复制（logical / publication / subscription）、同步级别、CDC 简介、高可用方案（Patroni 点到为止）
- 不展开：真实部署、故障切换演练、第三方 CDC 工具（Debezium）

## 任务清单

### Task 1 — 写 `schema.ts`

`probe(id serial PK, val text NOT NULL)`

### Task 2 — 写 `seed.sql`

`probe` 5 行。

### Task 3 — 写 Section 1：物理复制（流复制）

- **定义段要点**：基于 WAL 流的二进制复制 / 主库把 WAL 发给备库 / 备库 replay WAL / 只能整库复制 / 备库可只读（hot standby） / 不能跨大版本
- **语法骨架**：ASCII，主库 → walsender → 网络 → 备库 walreceiver → replay
- **mermaid**：加。画主备流复制管道图
- **Examples**：
  - `show-replication-role` — `SELECT pg_is_in_recovery()`（教学库返回 false 是主）；`support: 'partial'`
  - `pg-stat-replication` — `SELECT * FROM pg_stat_replication`（教学库无备库返回 0 行是教学点）；`support: 'partial'`
  - `replication-slots` — `SELECT slot_name, slot_type, active FROM pg_replication_slots`（返回 0 行也是教学点）；`support: 'partial'`

### Task 4 — 写 Section 2：同步级别

- **定义段要点**：`synchronous_commit` 控制 commit 何时返回 / `off` 不等盘 / `local` 主库盘 / `on`（默认）主库盘 + 同步备库盘（若配置） / `remote_apply` 等备库 replay 完 / 同步备库由 `synchronous_standby_names` 决定
- **语法骨架**：ASCII，4 个 `synchronous_commit` 值 + 含义
- **mermaid**：不加
- **Examples**：
  - `show-sync-params` — `SHOW synchronous_commit; SHOW synchronous_standby_names;`；`support: 'partial'`

### Task 5 — 写 Section 3：逻辑复制

- **定义段要点**：基于变更行（INSERT/UPDATE/DELETE）的复制 / 主库 `CREATE PUBLICATION` 选择哪些表 / 备库 `CREATE SUBSCRIPTION` 订阅 / 可跨大版本、可只复制部分表 / 不复制 DDL / `wal_level = logical`
- **语法骨架**：ASCII，`CREATE PUBLICATION` + `CREATE SUBSCRIPTION` 两条
- **mermaid**：加。画 publisher（多张表选订）→ subscription 拉取的关系
- **Examples**：
  - `wal-level-check` — `SHOW wal_level`（教学环境多为 replica，是教学点：逻辑复制需 logical）；`support: 'partial'`
  - `pg-publication-list` — `SELECT pubname FROM pg_publication`（返回 0 行也是教学点）；`support: 'partial'`

### Task 6 — 写 Section 4：CDC（Change Data Capture）

- **定义段要点**：CDC = 抓取数据变更供下游消费 / PG 用「逻辑解码」slot + 输出插件（pgoutput / wal2json / decoderbufs） / Debezium / Materialize 等都基于此 / 业务侧用：实时同步到 Kafka / 索引、数据湖
- **语法骨架**：ASCII，CDC 数据流：表 → WAL → 逻辑解码 → 输出插件 → 下游
- **mermaid**：不加
- **Examples**：
  - `inspect-decoding-plugins` — `SELECT name FROM pg_available_extensions WHERE name LIKE '%wal2json%' OR name = 'pgoutput'`；`support: 'partial'`

### Task 7 — 写 Section 5：高可用方案（Patroni 点到为止）

- **定义段要点**：HA 需要：监控、自动 failover、客户端路由 / Patroni（社区主流） + etcd/Consul 做选主 / 云厂商 RDS / Aurora 内置 HA / 客户端方：libpq 的 `target_session_attrs=read-write` 自动找主
- **语法骨架**：ASCII，HA 组件清单（监控 + 选主 + 路由）
- **mermaid**：加。画 Patroni + etcd 选主 + HAProxy / pgbouncer 路由的拓扑
- **Examples**：
  - `target-session-attrs-note` — `SELECT 'libpq target_session_attrs=read-write 让客户端只连主' AS note`；`support: 'partial'`

### Task 8 — 写 `index.ts`

`examples` 数组约 9 个。

### Task 9 — 注册到 `registry.ts`

## 完成验收 Checklist

### 内容边界
- [ ] 5 个 Section 主语依次为：流复制、同步级别、逻辑复制、CDC、HA
- [ ] 顶部 intro 段说明「教学环境只有单实例，本章 example 多数返回空，是教学点而非错误」
- [ ] Section 1、3、5 用 mermaid，label 无裸 `<` `>` `|`
- [ ] Patroni 仅点到为止

### 关键 Example 行为
- [ ] `show-replication-role` 在教学库返回 false
- [ ] `pg-stat-replication` 返回 0 行（明确在文案标注「这是正常的」）
