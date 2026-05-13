# 章节模板

本文档是 **agent 生成新 curriculum module 的输入**。产出物 = 1 个目录 + 4 个固定文件（`index.ts` / `index.md` / `schema.ts` / `seed.sql`）+ N 个 `examples/<id>.ts` 文件 + 在 `registry.ts` 注册一次。下文一切规则均强制，遇到冲突以本文件为准。

# 资料按需读取索引

**默认只读本文件即可开工**。下表的资料只在命中「何时读」列的情形时才打开，避免一次性把上下文塞爆。

| 资料 | 何时读 | 关键内容 |
|---|---|---|
| `./exampleDef.ts` | **写第一个 example 前必读** | `full` / `partial` / `none` 三档 + `timeoutMs` 的可粘贴代码样板 |
| `./curriculum-diagrams.md` | 给某子节画图前 | ASCII vs mermaid 子节级分流表 + mermaid 写作三个坑 |
| `../adr/0007-drizzle-dsl-preferred-sql-template-fallback.md` | 拿不准某 example 的 `support` 应该填什么 | 三档判定的完整论证（本文件 Checklist 已浓缩，多数时候不需展开） |
| `../design-overview.md` | 调 API 行为或对事务 / `search_path` 语义有疑问 | API 契约、`/exec` 事务约定、文件布局 |
| `../adr/0008-curriculum-module-content-structure.md` | 想知道为什么是这种章节结构（一般不需要） | 本文件「编写规范」节的源决策 |
| `../inferences/beautiful-mermaid.md` | 改 mermaid 渲染管道时（绝大多数章节不会触发） | 渲染端集成说明 |

# 大纲 → Module 硬规则

**`postgresql-study-outline.md` 的一个三级标题（`### N. 节点名`）= 一个 Module**。

- 不合并、不拆分。一个大纲节点产出一个 module 目录。
- group 按所在阶段映射：
  - 大纲「一、入门阶段」→ `basic`
  - 大纲「二、中级阶段」→ `intermediate`
  - 大纲「三、高级阶段」→ `advanced`
- 大纲该节点下的所有 bullet 都要在 module 内对应到 Section 或 Example，不允许遗漏。

# 章节分组与读者画像

只有三个 group。每个 group 的章节按对应"读者已会什么"写，**不要超出读者的当前能力解释**。

| group | 对应大纲 | 读者已会 | 假设的写作前提 |
|---|---|---|---|
| `basic` | 入门阶段 | 看得懂表格、能装 PG | 零 SQL 基础。术语首次出现要解释（行/列/主键/schema/...）。避免提及索引/事务/MVCC |
| `intermediate` | 中级阶段 | 基础 CRUD、主外键、单表 SELECT | 假设读者写过百行 SQL；可用术语：谓词、投影、限定符。可前向引用 basic 已讲过的概念 |
| `advanced` | 高级阶段 | 上过线、出过事故 | 假设读者关心生产问题：性能、并发、运维、可用性。可深入 PG 内部机制，可引用 EXPLAIN/pg_stat |

# 命名约束

- **`slug`**：kebab-case，单数（`join`、`transaction`、`index`、`view`、`vacuum`）。例外：CRUD 缩写、专有名词缩写按习惯（`crud`、`mvcc`、`wal`、`json`）。
- **schema 名**：后端自动从 slug 派生为 `m_<slug 中 - 换成 _>`（`foreign-keys` → `m_foreign_keys`）。**不要**在 `schema.ts` 里手写不一致的 schema 名。
- **example `id`**：kebab-case，形如 `<动作>-<细节>`（`select-where-eq`、`join-inner-on-eq`、`window-row-number`、`explain-seq-scan`）。
- **example 文件名**：与 `id` 一致（`select-where-eq.ts`）。
- **`order`**：组内从 1 开始连续编号，**不留空号**；同 group 内不重复。
- **section 编号**（`## 1. SELECT — 读取行`）：从 1 开始，主语 = SQL 关键字或机制名，破折号后接 3-7 字短语。

# 章节模块编写规范

每个 Section 必含的元素，按出现顺序：

1. **定义段**（必填，3-5 句，< 120 字）—— 这个功能是什么、做什么、返回什么形状的结果。**只讲事实，不废话**。
2. **`### 语法骨架`**（必填）—— 代码块 + 每个 placeholder 一条 bullet 解释允许的取值。ASCII 还是 mermaid 取决于子节内容形态，参见 `./curriculum-diagrams.md`。
3. **mermaid 关系图**（仅复杂主题加）—— 在语法骨架之后、Example 之前。粒度按子节判断，参见 `./curriculum-diagrams.md`。
4. **多个 Example 变体**（必填，按主题决定数量，简单 1-3 个，复杂 5-8 个）—— 每个变体只放一个 `:::example{id="..."}` 占位（**不要**在前面加 `### <短标题>`，卡片头部已经渲染 `ExampleDef.title`，重复一遍视觉冗余）。短标题写在 `ExampleDef.title` 字段里。

可选第 5 项：对于常用 SQL 优化或最佳实践写法，可在 Section 末尾补一小段。**仅限**有明确收益的实战技巧，不写"建议"、"注意"、"通常"。

## 明确不写的内容

下面这些**禁止**出现在 `index.md` 里，AI 容易跑偏，机械避开：

- ❌ 「易错点」「常见错误」小节
- ❌ 性能 side-note（除非整个 Module 主题就是性能）
- ❌ Example 占位前的 `### <短标题>`（卡片标题已渲染 `ExampleDef.title`，重复一遍视觉冗余）
- ❌ Example 占位下的解释段（卡片标题 + 双列代码已自解释）
- ❌ UI 控件描述（"点击运行按钮"、"右上角的..."）
- ❌ 跨模块的回顾性总结（"前面讲过 X，现在我们..."）

## 子节顺序原则

一个 Module 内多个 Section 的顺序按下面这条链判断，**自上而下匹配第一条命中的就用**：

1. **有依赖关系**：理解 B 必须先理解 A 时，A 在前（先 WHERE 再 GROUP BY；先 B-tree 再覆盖索引）。
2. **CRUD 类**：按生命周期排（建表/插入 → 查询 → 修改 → 删除）。
3. **机制类（事务/MVCC/索引/EXPLAIN）**：按 "是什么 → 怎么用 → 何时出问题" 三段排。
4. **形态枚举类**（JSONB 操作符、JOIN 类型）：按从最常用到最少用排。

**禁止**按字母序、按 SQL 关键字字典序、按出现频率排。

# 数据持久化与重置语义

写 example 时**必须知道**的执行模型（详见 `apps/api/src/routes/modules.ts` 的 `/exec` 与 `/reset` 端点）：

- 用户进入某个章节后，每点一次"运行"，后端在一个 drizzle 事务里依次执行 `SET LOCAL search_path = m_<slug>, pg_catalog` + `SET LOCAL statement_timeout` + 调用 `example.execute(tx)`，**正常返回则提交**。
- 也就是说，INSERT / UPDATE / DELETE 类 example **真实写入持久化**。切换到别的章节再回来该章节，数据不变。
- 只有用户点页面右上角的"重置本模块"按钮，后端才会 `DROP SCHEMA "m_<slug>" CASCADE` + 重建 schema + 重新跑 `seed.sql`。
- 由此，写 example 必须遵守：
  - **不要**假设每次运行从 seed 状态开始。
  - 写操作类 example 之间不能互相破坏（多次跑同一个 example 应自洽；不同 example 顺序无关）。常用手段：INSERT 用 `ON CONFLICT DO NOTHING/UPDATE`、UPDATE 用表达式（`SET name = name || '_x'` 而不是 `SET name = 'fixed'`）、DELETE 限定到刚刚 INSERT 的行。
  - 同 module 多个 example 之间避免依赖隐式顺序。

# Seed 数据规模引导

`seed.sql` 数据量按教学目的定，不是越多越好：

| 子节性质 | 建议规模 | 说明 |
|---|---|---|
| 语法形态（CRUD、JOIN、WHERE、子查询） | 3-10 行 | 学生肉眼能在结果窗看完 |
| 分组 / 排序 / 窗口（GROUP BY、窗口函数、LIMIT/OFFSET） | 20-100 行 | 看得出排序边界和聚合效果 |
| 索引 / 执行计划（EXPLAIN、索引选型、统计信息） | 1 万行起步 | 用 `generate_series(1, 10000)` 生成；同时在对应 example 用 `timeoutMs: 30000` 提升超时 |
| JSONB / 全文搜索 | 50-500 行 | 真实结构的半结构化数据，避免全是 `{"k": "v"}` 的玩具示例 |
| 复制 / 备份 / WAL | 不需要数据 | 这类主题通常只看系统视图或元命令 |

`seed.sql` 内部约定：执行前 `search_path` 已被设为 `m_<slug>, pg_catalog`，**不要**写完整 schema 限定（参见 `apps/api/src/curriculum/basic/relational-basics/seed.sql` 的注释样式）。

# 章节画图规范

参见 `./curriculum-diagrams.md`：①按子节内容形态选 ASCII 还是 mermaid；②写 mermaid 时机械避三个坑（`|` 会被吞、`<` `>` 用 entity、渲染走 fence rule）。

# 常见踩坑速查

第 1-25 章生成过程中反复出现、容易写错的几条 PG 语义。**写新章节前先扫一遍**，对号入座。

## 1. seed.sql 用显式 `id` 后必须追平自增序列

`INSERT ... VALUES (1, ...), (2, ...), ...` 配合 `ON CONFLICT (id) DO NOTHING` 是 `/reset` 后重入幂等的标准做法，但 PG 的 `serial` / `bigserial` 列**不会感知**显式 id，sequence 仍从 1 开始；下一次 example 用默认 `nextval` 就会撞主键。

**收尾两行模板**（直接复制）：

```sql
SELECT setval(pg_get_serial_sequence('authors', 'id'), (SELECT max(id) FROM authors));
SELECT setval(pg_get_serial_sequence('books',   'id'), (SELECT max(id) FROM books));
```

## 2. 不支持 `IF NOT EXISTS` 的 DDL，用 DO 块兜底

PG 部分 DDL 没有 `IF NOT EXISTS` 语法，但 example 必须可重入。统一改用匿名 DO 块：

| 目标 | ❌ 不支持 | ✅ 重入安全写法 |
|---|---|---|
| 建 role | `CREATE ROLE x IF NOT EXISTS` | `DO $$ BEGIN IF NOT EXISTS (SELECT 1 FROM pg_roles WHERE rolname='x') THEN CREATE ROLE x; END IF; END $$;` |
| 加约束 | `ALTER TABLE ... ADD CONSTRAINT IF NOT EXISTS` | `DO $$ BEGIN IF NOT EXISTS (SELECT 1 FROM pg_constraint WHERE conname='x') THEN ALTER TABLE ... ADD CONSTRAINT x ...; END IF; END $$;` |
| 加 ENUM 值 | `ALTER TYPE t ADD VALUE 'x'` 重跑撞错 | `ALTER TYPE t ADD VALUE IF NOT EXISTS 'x'` （PG 12+ 原生支持，**唯一**支持 IF NOT EXISTS 的 ENUM 修改方式） |
| 建 SCHEMA / TABLE / INDEX / EXTENSION | — | 都原生支持 `IF NOT EXISTS`，直接用 |

## 3. 不能在事务里跑的语句

后端 `/exec` 把 example 包在一个 drizzle 事务里执行。下列语句**会直接抛错**：

| 语句 | 报错 | 替代教学手段 |
|---|---|---|
| `VACUUM` / `VACUUM FULL` | `VACUUM cannot run inside a transaction block` | `display.sql` 仅展示真实 SQL；`execute` 改读 `pg_stat_user_tables.n_dead_tup` / `last_vacuum` 等监控视图，让学生看到 vacuum 留下的可观测痕迹 |
| `CREATE INDEX CONCURRENTLY` / `REINDEX CONCURRENTLY` | 同上 | 同上（或 example 改用非 concurrently 版本，注释里说明区别） |
| `ALTER SYSTEM SET ...` | 不报错但跨连接持久化 | 一律用 `SET LOCAL <name> = ...`，事务内生效不污染其他 example |
| `ALTER TYPE t ADD VALUE` 后**同事务内使用**新值 | `unsafe use of new value` | 两条语句拆到两个 example，或只 ADD 不在本 example 用 |

## 4. 演示"故意失败"的约束违例用临时表

CHECK / UNIQUE / EXCLUDE / FK / ENUM / DOMAIN 违例 example 直接打主表会有副作用：

- 即便事务回滚，对学生而言"我什么都没看到"
- 多次跑可能因为前次部分提交留下脏数据

**模板**：example 内 `CREATE TEMP TABLE demo_xxx (...)` + 插一行违例值 + 抛错后事务自动回滚、临时表跟着消失。优势：

- 完全隔离主表
- 无需 cleanup（事务结束 = 自动 DROP）
- SQLSTATE 抛给前端，学生在卡片看到 23xxx 错误码即教学目标

参见 `intermediate/advanced-types/examples/domain-define-and-use.ts` / `enum-define-and-use.ts` 的写法。

## 5. EXPLAIN / VACUUM / 大数据 example 必须覆盖 `timeoutMs`

默认 `statement_timeout = 5000` 在 1 万行+ 的 EXPLAIN ANALYZE 上会超时。`ExampleDef` 加一行：

```ts
timeoutMs: 30000,
```

适用：EXPLAIN ANALYZE 全部、VACUUM 监控视图读、`generate_series(1, N)` 中 N ≥ 10000 的 seed 产物之上的查询。

# ExampleDef 代码样板

参见 `./exampleDef.ts`，覆盖 `full` / `partial` / `none` 三档及 `timeoutMs` 覆盖默认超时的写法。**复制对应分支后再改占位**，不要凭记忆手写 `ExampleDef` 字段。

# 简易模板示例

下面是一个 Section 的最小可行写法（按 `basic/curd` v0 demo 风格示意，curd module 已下线，结构沿用），把"编写规范"的四个必填元素映射到具体片段：

````markdown
## 1. SELECT — 读取行

SELECT 从表里读取行，是 SQL 最基础的动作。声明式：你描述要哪些行的哪些列、
按什么顺序，PG 决定怎么取。返回结果是一个行集合，没有 `ORDER BY` 时顺序未定义。

### 语法骨架

```text
SELECT  <columns>
FROM    <table>
[WHERE  <predicate>]
[ORDER BY <key> [ASC|DESC]]
[LIMIT  <n>];
```

- `<columns>`：`*` / `col1, col2` / 表达式 `lower(name)` / 聚合 `count(*)`
- `<table>`：表名
- `WHERE`：行过滤（下一节专门讲）
- `ORDER BY`：排序，`ASC` 升序 / `DESC` 降序
- `LIMIT`：取前 N 行

:::example{id="select-all"}

:::example{id="select-cols"}
````

对应关系：

1. **定义段** —— `## 1. SELECT` 下面那一段，3-5 句、< 120 字，讲清"是什么 / 做什么 / 返回什么形状"。
2. **`### 语法骨架`** —— `text` 代码块 + 每个 `<placeholder>` 一条 bullet。本节是线性子句序列，用 ASCII；INSERT/WHERE/JOIN 等带分支或关系的主题改用 mermaid。
3. **Example 变体** —— 每个变体一个 `:::example{id="..."}` 占位，**不写解释段、不加 `### 短标题`**（卡片自己渲染 `ExampleDef.title`）。`id` 必须和 `examples/<id>.ts` 里 `ExampleDef.id` 完全一致；短标题写在 `ExampleDef.title` 里。
4. **mermaid 关系图** —— 本节没加；只有 JOIN、CTE、MVCC、事务隔离、索引、查询计划、复制拓扑等复杂主题才加，位置在"语法骨架之后、Example 之前"。

# 模板文件夹结构

新章节放在 `apps/api/src/curriculum/<group>/<slug>/`，`<group>` ∈ `basic | intermediate | advanced`。

```
apps/api/src/curriculum/
├─ types.ts                      # ModuleDef / ExampleDef 类型定义（不要改）
├─ registry.ts                   # 在这里 import 新 module 并加入 all[]
└─ <group>/
   └─ <slug>/
      ├─ index.ts                # ModuleDef 默认导出
      ├─ index.md                # 章节正文，按上文「编写规范」写
      ├─ schema.ts               # drizzle 表声明，统一挂在 pgSchema('m_<slug>') 下
      ├─ seed.sql                # ensure() 首次建 schema 后执行的前置 SQL
      └─ examples/
         └─ <example-id>.ts      # 每个 example 一个文件，默认导出 ExampleDef
```

各文件职责：

- **`index.ts`** —— 导出 `ModuleDef`，字段：`slug`、`group`、`title`、`order`、`markdown`（thunk，读 `index.md`）、`seedSql`（thunk，读 `seed.sql`）、`examples`（按 `index.md` 出现顺序排列的 `ExampleDef[]`）。`markdown`/`seedSql` 用 thunk 是为了 dev 改文件无需重启 tsx watch。
- **`index.md`** —— 学生看到的章节正文。`:::example{id="..."}` 占位的 `id` 必须和 `examples/<id>.ts` 里 `ExampleDef.id` 一一对得上。
- **`schema.ts`** —— 用 `pgSchema('m_<slug 中 - 换成 _>')` 建一个独立 schema，所有表都挂在它下面，避免和其他 module 冲突。
- **`seed.sql`** —— `ensure()` 端点首次创建 schema 后执行。执行前 `search_path` 已被设为 `m_<slug>, pg_catalog`，所以 SQL 里不用写完整 schema 限定。
- **`examples/<id>.ts`** —— 默认导出 `ExampleDef`，**复制 `./exampleDef.ts` 对应分支后改占位**。

# Checklist

写完后过一遍下面 7 条。规范里已经写过的细节不在这里重复；记不清就回查对应章节。

- [ ] 每个 Section 的 4 个必填元素齐全（定义段 / 语法骨架 /（如适用）mermaid / Example 变体）
- [ ] 每个 example 的 `id` 三处一致：`index.md` 的 `:::example{id="..."}` / 文件名 `examples/<id>.ts` / `ExampleDef.id`
- [ ] 每个 example 的 `support` 按 ADR-0007 判定准确（`full` / `partial` / `none`）
- [ ] 写操作类 example 可重复运行不出错（INSERT 用 `ON CONFLICT`、UPDATE 用表达式、DELETE 限定自己 INSERT 的行）
- [ ] mermaid label 没有裸 `<` `>` `|`
- [ ] 已在 `apps/api/src/curriculum/registry.ts` 加进 `all` 数组（漏了前端列不出来）
- [ ] `pnpm dev` 跑通：`/ensure` 返回 `created`；每个 example 的 `/exec` 都返回 200
