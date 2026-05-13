# 章节生成任务：14. 全文搜索

> **Agent 开工前必读**：`docs/chapter-template/chapter-template.md`
> 本文件只提供本章节的具体决策与任务清单。

## 章节基本信息

| 字段 | 值 |
|---|---|
| 大纲来源 | `postgresql-study-outline.md` → 「二、中级阶段 → 6. 全文搜索」 |
| group | `intermediate` |
| slug | `full-text-search` |
| schema | `m_full_text_search` |
| order | 6 |
| 读者画像 | 已会 CRUD、索引（→ ch10） |

## 教学边界

- 覆盖：tsvector / tsquery、`@@` 匹配、`to_tsvector` / `to_tsquery`、`plainto_tsquery` / `websearch_to_tsquery`、ts_rank、GIN 索引
- 中文分词需要 zhparser 扩展，本章用英文为主，**单独一节点到「中文分词需要扩展」**，不展开安装

## 任务清单

### Task 1 — 写 `schema.ts`

`articles(id serial PK, title text NOT NULL, body text NOT NULL, lang text NOT NULL DEFAULT 'english')`

可选物化列：`tsv tsvector GENERATED ALWAYS AS (to_tsvector('english', title || ' ' || body)) STORED`

### Task 2 — 写 `seed.sql`

`articles` 8 行英文短文，主题涵盖 sql、postgres、index、jsonb 等。

### Task 3 — 写 Section 1：tsvector 与 tsquery

- **定义段要点**：`tsvector` = 切好词且去停用词后的「文档表示」 / `tsquery` = 查询表达式（含 `&` `|` `!`） / `@@` 是匹配操作符 / `to_tsvector(config, text)` 用指定配置切词
- **语法骨架**：ASCII，`SELECT to_tsvector('english', '...') @@ to_tsquery('english', '...')`
- **mermaid**：加。画「原文 → to_tsvector → tsvector / 查询 → to_tsquery → tsquery → @@ 匹配」流程
- **Examples**：
  - `tsvector-basic` — `SELECT to_tsvector('english', 'A quick brown fox jumps')`；`support: 'partial'`
  - `tsquery-basic` — `SELECT to_tsquery('english', 'quick & fox')`；`support: 'partial'`
  - `match-operator` — `SELECT to_tsvector(...) @@ to_tsquery(...)`；`support: 'partial'`

### Task 4 — 写 Section 2：查询解析器（to_tsquery / plainto / websearch）

- **定义段要点**：`to_tsquery` 用户写规范查询（含 `&` `|` `!` `<->`） / `plainto_tsquery` 把句子按 AND 连 / `phraseto_tsquery` 按词序 / `websearch_to_tsquery` 接受 Google 风格（含引号短语、`-` 排除）
- **语法骨架**：ASCII，4 个函数对照
- **mermaid**：不加
- **Examples**：
  - `plainto-tsquery` — `plainto_tsquery('english', 'quick fox')` 对比 `to_tsquery`；`support: 'partial'`
  - `websearch-tsquery` — `websearch_to_tsquery('english', '"quick fox" -lazy')`；`support: 'partial'`

### Task 5 — 写 Section 3：在表中做全文搜索

- **定义段要点**：实战做法 = 加一个 GENERATED tsvector 列 + 建 GIN 索引 / 查询用 `WHERE tsv @@ to_tsquery(...)` / 配合 `ts_rank` 排序
- **语法骨架**：ASCII，物化列 + GIN + WHERE @@ 三段
- **mermaid**：不加
- **Examples**：
  - `search-articles` — `SELECT id, title FROM articles WHERE tsv @@ to_tsquery('english', 'postgres')`；`support: 'partial'`
  - `search-with-rank` — `SELECT id, title, ts_rank(tsv, q) AS rank FROM articles, to_tsquery('english', 'index') q WHERE tsv @@ q ORDER BY rank DESC`；`support: 'partial'`
  - `gin-on-tsvector` — `CREATE INDEX IF NOT EXISTS articles_tsv_gin ON articles USING gin (tsv)` + EXPLAIN；`support: 'partial'`

### Task 6 — 写 Section 4：高亮与摘要 ts_headline

- **定义段要点**：`ts_headline(config, document, query)` 返回带 `<b>...</b>` 高亮的片段 / 适合搜索结果摘要 / 不走索引，仅在「结果集已确定后」对每行调用
- **语法骨架**：ASCII，`ts_headline('english', body, query)`
- **mermaid**：不加
- **Examples**：
  - `headline-snippet` — `SELECT id, ts_headline('english', body, q) FROM articles, to_tsquery('english', 'index') q WHERE tsv @@ q`；`support: 'partial'`

### Task 7 — 写 Section 5：中文分词（点到为止）

- **定义段要点**：PG 内置的 `simple`、`english` 等配置不会切中文（按字符切） / 中文分词需要 `zhparser`、`pg_jieba` 等扩展 / 本节只演示「不分词时中文怎么表现」，不展开安装
- **语法骨架**：ASCII，对比 `to_tsvector('english', '中文 SQL')` 与如果有 `zhparser` 的预期表现
- **mermaid**：不加
- **Examples**：
  - `chinese-without-zhparser` — `SELECT to_tsvector('simple', '我爱 PostgreSQL 数据库')` 观察分词结果；`support: 'partial'`

### Task 8 — 写 `index.ts`

`examples` 数组约 11 个。

### Task 9 — 注册到 `registry.ts`

## 完成验收 Checklist

### 内容边界
- [ ] 5 个 Section 主语依次为：tsvector/tsquery、查询解析器、表中全文搜索、ts_headline、中文分词
- [ ] Section 1 mermaid label 无裸 `<` `>` `|`
- [ ] 中文分词只点到为止，不教扩展安装

### Schema / Seed
- [ ] `articles` 至少 8 行英文，含 GENERATED tsvector 列
- [ ] seed 包含「postgres」「index」等关键词以撑搜索 example

### 关键 Example 行为
- [ ] `search-articles` 返回 ≥ 1 行
- [ ] `gin-on-tsvector` 的 EXPLAIN 含 `Bitmap Index Scan`
- [ ] `headline-snippet` 输出含 `<b>` 标记
