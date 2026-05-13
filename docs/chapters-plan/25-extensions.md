# 章节生成任务：25. 扩展与生态

> **Agent 开工前必读**：`docs/chapter-template/chapter-template.md`
> 本文件只提供本章节的具体决策与任务清单。

## 章节基本信息

| 字段 | 值 |
|---|---|
| 大纲来源 | `postgresql-study-outline.md` → 「三、高级阶段 → 9. 扩展与生态」 |
| group | `advanced` |
| slug | `extensions` |
| schema | `m_extensions` |
| order | 9 |
| 读者画像 | 已完整学完基础与中级，了解 PG 体系结构 |

## 章节特殊性

扩展是否能装取决于教学环境。本章策略：
- 每个扩展都先 `SELECT FROM pg_available_extensions` 看是否可用
- 能装的扩展给 `CREATE EXTENSION IF NOT EXISTS` 的 example
- 装不上的（PostGIS / TimescaleDB / pg_cron）只给概念 + pg_available_extensions 检查 example
- **不在 example 里 DROP EXTENSION**（避免破坏共享教学环境）

## 教学边界

- 覆盖：扩展机制、pg_stat_statements（→ ch19 已点）、pgvector、PostGIS / TimescaleDB、pg_trgm、pg_cron、pgcrypto、hypopg
- 不展开：自己写扩展、扩展打包发布、各扩展深度用法

## 任务清单

### Task 1 — 写 `schema.ts`

`probe(id serial PK, val text NOT NULL)`

### Task 2 — 写 `seed.sql`

`probe` 5 行。

### Task 3 — 写 Section 1：扩展机制

- **定义段要点**：`CREATE EXTENSION <name>` 装 / 扩展可加新类型、函数、操作符、索引方法 / 装在指定 schema 或全局 / `pg_available_extensions` 列可装 / `pg_extension` 列已装 / `DROP EXTENSION` 卸（CASCADE 连同对象）
- **语法骨架**：ASCII，`CREATE EXTENSION IF NOT EXISTS <name> [SCHEMA <s>] [VERSION <v>]`
- **mermaid**：不加
- **Examples**：
  - `list-available-extensions` — `SELECT name, default_version, installed_version FROM pg_available_extensions ORDER BY name LIMIT 30`；`support: 'partial'`
  - `list-installed-extensions` — `SELECT extname, extversion FROM pg_extension`；`support: 'partial'`

### Task 4 — 写 Section 2：pg_stat_statements

- **定义段要点**：每条 SQL 模板的累计性能统计 / 必须 `shared_preload_libraries` 含 `pg_stat_statements` 才能启 / 查 `pg_stat_statements` 视图按 `mean_exec_time` / `total_exec_time` 排序找慢查询 / 已在 ch19 点过
- **语法骨架**：ASCII，`CREATE EXTENSION IF NOT EXISTS pg_stat_statements` + `SELECT ... FROM pg_stat_statements`
- **mermaid**：不加
- **Examples**：
  - `pg-stat-statements-availability` — `SELECT installed_version FROM pg_available_extensions WHERE name = 'pg_stat_statements'`；`support: 'partial'`

### Task 5 — 写 Section 3：pgvector — 向量索引

- **定义段要点**：定义 `vector(dim)` 类型 / 操作符：`<->` L2 / `<=>` cosine / `<#>` inner product / 索引方法：HNSW（推荐） / IVFFlat / 用于 RAG、推荐
- **语法骨架**：ASCII，`vector(N)` 类型 + 操作符表
- **mermaid**：加。画 ANN 索引 HNSW 多层图（顶层稀疏 → 底层密集）
- **Examples**：
  - `pgvector-availability` — `SELECT installed_version FROM pg_available_extensions WHERE name = 'vector'`；`support: 'partial'`
  - `pgvector-demo` — 如果可用：`CREATE EXTENSION IF NOT EXISTS vector` + 临时表 `(id serial, embedding vector(3))` + 插几行 + `SELECT id, embedding <-> '[1,2,3]'::vector AS dist FROM ... ORDER BY dist LIMIT 3` + 末尾 DROP TABLE；不可用时 example 会报错（教学点）；`support: 'partial'`

### Task 6 — 写 Section 4：PostGIS / TimescaleDB（介绍）

- **定义段要点**：PostGIS = 地理空间扩展 / 类型 geometry / geography、操作符 `&&` `~`、GiST 索引 / TimescaleDB = 时序扩展，把表变 hypertable 自动分区 + 压缩 / 两者通常需独立包安装，教学环境不一定有
- **语法骨架**：ASCII，PostGIS 用法骨架 + TimescaleDB 用法骨架
- **mermaid**：不加
- **Examples**：
  - `postgis-availability` — `SELECT installed_version FROM pg_available_extensions WHERE name = 'postgis'`；`support: 'partial'`
  - `timescaledb-availability` — `SELECT installed_version FROM pg_available_extensions WHERE name = 'timescaledb'`；`support: 'partial'`

### Task 7 — 写 Section 5：pg_trgm — 模糊搜索

- **定义段要点**：基于三字组（trigram）算字符串相似度 / 操作符 `%`、`<->`、`similarity()` / 可建 GIN/GiST 索引加速 `LIKE '%xxx%'`
- **语法骨架**：ASCII，`CREATE EXTENSION pg_trgm` + 操作符
- **mermaid**：不加
- **Examples**：
  - `pg-trgm-availability` — `SELECT installed_version FROM pg_available_extensions WHERE name = 'pg_trgm'`；`support: 'partial'`
  - `pg-trgm-similarity` — 如可用：`CREATE EXTENSION IF NOT EXISTS pg_trgm` + `SELECT similarity('hello', 'helo'), 'hello' % 'helo'`；`support: 'partial'`

### Task 8 — 写 Section 6：pg_cron — 库内调度

- **定义段要点**：库内 cron / `cron.schedule('name', '* * * * *', '<sql>')` 注册 / 不少托管服务（Supabase 等）默认装 / 适合定期清理、报表 / 替代品：外部调度器
- **语法骨架**：ASCII，`cron.schedule` 函数签名
- **mermaid**：不加
- **Examples**：
  - `pg-cron-availability` — `SELECT installed_version FROM pg_available_extensions WHERE name = 'pg_cron'`；`support: 'partial'`

### Task 9 — 写 Section 7：pgcrypto — 加密

- **定义段要点**：哈希 `digest(data, 'sha256')` / 对称加密 `pgp_sym_encrypt / pgp_sym_decrypt` / 随机 UUID `gen_random_uuid()`（也在 ch06 出现） / 适合敏感字段加密存储
- **语法骨架**：ASCII，常用函数清单
- **mermaid**：不加
- **Examples**：
  - `pgcrypto-availability` — `SELECT installed_version FROM pg_available_extensions WHERE name = 'pgcrypto'`；`support: 'partial'`
  - `pgcrypto-digest-uuid` — 如可用：`CREATE EXTENSION IF NOT EXISTS pgcrypto` + `SELECT encode(digest('hello', 'sha256'), 'hex'), gen_random_uuid()`；`support: 'partial'`

### Task 10 — 写 Section 8：hypopg — 虚拟索引

- **定义段要点**：在不真建索引的情况下假装索引存在 / `hypopg_create_index('CREATE INDEX ON ...')` 创建虚拟 / EXPLAIN 会把它纳入 planner / 适合大表索引前评估
- **语法骨架**：ASCII，`hypopg_create_index` + `hypopg_reset`
- **mermaid**：不加
- **Examples**：
  - `hypopg-availability` — `SELECT installed_version FROM pg_available_extensions WHERE name = 'hypopg'`；`support: 'partial'`

### Task 11 — 写 `index.ts`

`examples` 数组约 14 个。

### Task 12 — 注册到 `registry.ts`

## 完成验收 Checklist

### 内容边界
- [ ] 8 个 Section 主语依次为：扩展机制、pg_stat_statements、pgvector、PostGIS/Timescale、pg_trgm、pg_cron、pgcrypto、hypopg
- [ ] 每个扩展都先有 availability 检查 example
- [ ] Section 3 用 mermaid，label 无裸 `<` `>` `|`

### 重入安全（本章 critical）
- [ ] 所有扩展用 `CREATE EXTENSION IF NOT EXISTS`，**不**在 example 里 `DROP EXTENSION`
- [ ] 临时表 / 列演示用 `IF NOT EXISTS` + 末尾 `DROP TABLE IF EXISTS`
- [ ] 扩展未安装时 example 报错是预期教学行为，文档需明确说明

### 关键 Example 行为
- [ ] `list-available-extensions` 返回 ≥ 1 行
- [ ] `list-installed-extensions` 至少含 plpgsql
- [ ] 不要求所有扩展 example 必须跑通，只要可用性检查必须跑通
