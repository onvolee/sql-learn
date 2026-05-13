# 章节生成任务：13. JSON 与 JSONB

> **Agent 开工前必读**：`docs/chapter-template/chapter-template.md`
> 本文件只提供本章节的具体决策与任务清单。

## 章节基本信息

| 字段 | 值 |
|---|---|
| 大纲来源 | `postgresql-study-outline.md` → 「二、中级阶段 → 5. JSON 与 JSONB」 |
| group | `intermediate` |
| slug | `jsonb` |
| schema | `m_jsonb` |
| order | 5 |
| 读者画像 | 已会基础 CRUD、索引（→ ch10），知道 jsonb 走 GIN |

## 教学边界

- 覆盖：json vs jsonb、操作符、jsonb_set / jsonb_path_query、GIN 索引
- 不展开：性能调优（→ ch17）、jsonb 与全文搜索结合（→ ch14）

## 任务清单

### Task 1 — 写 `schema.ts`

`docs(id serial PK, title text NOT NULL, body jsonb NOT NULL)`

### Task 2 — 写 `seed.sql`

`docs` 8 行，`body` 含嵌套结构（含 `tags` 数组、`author` 对象、`stats` 数字）。

### Task 3 — 写 Section 1：json vs jsonb

- **定义段要点**：`json` 保存原始文本，每次解析 / `jsonb` 二进制存储、键无重复、查找快 / `jsonb` 支持索引 / 实战几乎只用 jsonb / json 仅在需要保留键顺序或重复键时用
- **语法骨架**：ASCII，两个列类型 + 一句对比
- **mermaid**：不加
- **Examples**：
  - `inspect-storage-difference` — `SELECT '{"a":1, "a":2}'::json, '{"a":1, "a":2}'::jsonb`（看 jsonb 去重为 `{"a":2}`）；`support: 'partial'`

### Task 4 — 写 Section 2：操作符

- **定义段要点**：`->` 取键得 jsonb / `->>` 取键得 text / `#>` 路径取 jsonb / `#>>` 路径取 text / `@>` 包含 / `?` 键存在 / `?|` 任一键 / `?&` 所有键
- **语法骨架**：ASCII，操作符对照表
- **mermaid**：不加
- **Examples**：
  - `arrow-vs-double-arrow` — `body -> 'author'` vs `body ->> 'title'`；`support: 'partial'`
  - `path-operator` — `body #> '{author,name}'` 与 `body #>> '{author,name}'`；`support: 'partial'`
  - `contains-operator` — `WHERE body @> '{"tags": ["sql"]}'`；`support: 'partial'`
  - `key-exists` — `WHERE body ? 'stats'`；`support: 'partial'`

### Task 5 — 写 Section 3：函数 — jsonb_set / jsonb_path_query / jsonb_array_elements

- **定义段要点**：`jsonb_set(target, path[], new_value)` 改/加键 / `jsonb_path_query(j, '$.tags[*]')` 走 JSONPath / `jsonb_array_elements(j)` 展开数组到行
- **语法骨架**：ASCII，3 个函数签名
- **mermaid**：不加
- **Examples**：
  - `jsonb-set-update` — `UPDATE docs SET body = jsonb_set(body, '{stats,views}', '100') WHERE id = 1`；`support: 'partial'`
  - `jsonb-path-query` — `SELECT jsonb_path_query(body, '$.tags[*]') FROM docs WHERE id = 1`；`support: 'partial'`
  - `jsonb-array-elements-unnest` — `SELECT id, t FROM docs, jsonb_array_elements_text(body->'tags') t`；`support: 'partial'`

### Task 6 — 写 Section 4：GIN 索引加速查询

- **定义段要点**：jsonb 上建 GIN 索引可加速 `@>`、`?`、`?|`、`?&` / 默认 opclass 索引所有键和值 / `jsonb_path_ops` 只索引值、更小更快但仅支持 `@>`
- **语法骨架**：ASCII，两种 opclass 对照
- **mermaid**：不加
- **Examples**：
  - `gin-default-opclass` — `CREATE INDEX IF NOT EXISTS docs_body_gin ON docs USING gin (body)` + `EXPLAIN ... WHERE body @> '{"tags":["sql"]}'`；`support: 'partial'`
  - `gin-path-ops-opclass` — `CREATE INDEX IF NOT EXISTS docs_body_gin_path ON docs USING gin (body jsonb_path_ops)` + 对比体积；`support: 'partial'`

### Task 7 — 写 `index.ts`

`examples` 数组约 10 个。

### Task 8 — 注册到 `registry.ts`

## 完成验收 Checklist

### 内容边界
- [ ] 4 个 Section 主语依次为：json vs jsonb、操作符、函数、GIN 索引
- [ ] 未深入 jsonb 与全文搜索结合（→ ch14）

### 重入安全
- [ ] `jsonb-set-update` 用 SAVEPOINT 或 UPDATE 表达式幂等
- [ ] 所有索引建用 `IF NOT EXISTS`

### 关键 Example 行为
- [ ] `contains-operator` 至少返回 1 行（确保 seed 含 sql 标签）
- [ ] `gin-default-opclass` 的 EXPLAIN 含 `Bitmap Index Scan`
