# Design Overview

详细决策见 [docs/adr/](./adr/)；术语见 [CONTEXT.md](../CONTEXT.md)。

## Vision

一个本地交互式 PostgreSQL 学习站。

- 大纲见 `../postgresql-study-outline.md`，三阶段共 25+ 个学习节点
- 每个节点 = 一个 **Module** = 一条 vue-router 路由 = 一个 PG schema = 一个内容目录
- 每个 Module 包含 Tutorial 文字 + 若干 **Example**
- 每个 Example **左右分栏**展示 drizzle 写法 + SQL 写法（都只读），右下角"运行"按钮真实命中本地 Docker PG，结果展示在下方

## Stack

| 层 | 技术 |
|---|---|
| 包管理 | pnpm workspace（`apps/web` + `apps/api`） |
| 数据库 | PostgreSQL 18 (Docker, port 54322) |
| 后端 | Hono + drizzle-orm + node-postgres |
| 前端 | Vue 3 + Vite + TypeScript + Element Plus + vue-router + pinia + markdown-it |
| 运行时 | Node 24（最新 LTS / current，用 `--env-file` 加载 `.env`） |

## Architecture

```
┌─────────────────────┐         HTTP          ┌─────────────────────┐
│  apps/web (Vue3)    │ ──────────────────►   │  apps/api (Hono)    │
│  - 左侧 el-menu     │  /api/modules         │  - listModules()    │
│  - 右侧 Markdown    │  /api/modules/:slug   │  - getModule()      │
│    + CodeExample    │  /ensure /reset /exec │  - drizzle pool     │
└─────────────────────┘                       └──────────┬──────────┘
                                                          │ pg socket
                                                          ▼
                                              ┌─────────────────────┐
                                              │  Docker: postgres   │
                                              │  - sqllearn 数据库  │
                                              │  - m_curd / m_joins │
                                              │    / m_window …     │
                                              └─────────────────────┘
```

## 文件布局

```
/
├── CONTEXT.md                      ← 术语表（[[Module]] [[Example]] [[Schema]] 等）
├── docs/
│   ├── design-overview.md          ← 本文件
│   └── adr/                        ← 0001..0007
├── docker-compose.yml              ← PG 18，端口 54322，volume pgdata
├── infra/postgres/init/
│   └── 01-create-app-role.sql      ← 首次启动创建非超管 app 角色
├── package.json                    ← 根脚本：db:up / dev / ...
├── pnpm-workspace.yaml
├── tsconfig.base.json
└── apps/
    ├── api/
    │   ├── package.json
    │   ├── tsconfig.json
    │   ├── .env / .env.example     ← DATABASE_URL / PORT
    │   └── src/
    │       ├── index.ts            ← Hono entry + CORS + 路由挂载
    │       ├── db.ts               ← pg Pool + drizzle 实例
    │       ├── routes/
    │       │   └── modules.ts      ← list/get/ensure/reset/exec
    │       └── curriculum/
    │           ├── types.ts        ← ModuleDef / ExampleDef
    │           ├── registry.ts     ← 汇总所有 Module
    │           └── basic/curd/     ← walking skeleton 的第一个 Module
    │               ├── index.md
    │               ├── schema.ts
    │               ├── seed.sql
    │               ├── index.ts    ← 装配 ModuleDef
    │               └── examples/
    │                   ├── select-all.ts
    │                   ├── insert-one.ts
    │                   ├── select-where.ts
    │                   ├── update-one.ts
    │                   └── delete-one.ts
    └── web/
        ├── package.json
        ├── tsconfig.{json,app,node}.json
        └── src/                    ← 尚未填充（见"实现状态"）
```

## API 契约

| Method | Path | 用途 | 返回 |
|---|---|---|---|
| GET | `/api/modules` | 拉菜单 | `{ modules: [{slug, group, title, order}] }` |
| GET | `/api/modules/:slug` | 拉单 Module 内容 | `{ slug, group, title, markdown, examples: [{id, support, display, runnable}] }` |
| POST | `/api/modules/:slug/ensure` | 首次进入时调，幂等 | `{ schema, status: 'exists'|'created' }` |
| POST | `/api/modules/:slug/reset` | 用户点击"重置本模块" | `{ schema, status: 'reset' }` |
| POST | `/api/modules/:slug/exec` | 运行某 Example | `{ columns, rows, rowCount, durationMs }` 或 `{ error, durationMs }` |
| GET | `/health` | 健康检查 | `{ ok: true }` |

执行细节：`/exec` 体内 `{ exampleId }`，后端查 registry 找到对应 `execute()`，在事务里依次 `SET LOCAL search_path = m_<slug>, pg_catalog` + `SET LOCAL statement_timeout = 5000` 后执行。

## 决策日志

| ADR | 决策 |
|---|---|
| [0001](./adr/0001-local-docker-pg-with-hono-backend.md) | 用 Docker PG + Hono 后端（vs PGlite / Serverless） |
| [0002](./adr/0002-module-isolation-via-search-path.md) | Module 隔离用 `search_path` + 单 app 角色 |
| [0003](./adr/0003-per-module-pg-schema.md) | 每个 Module 一个 PG schema `m_<slug>` |
| [0004](./adr/0004-lazy-seed-and-manual-reset.md) | 懒首次 seed + 手动重置按钮，无 undo |
| [0005](./adr/0005-dual-display-sql-and-drizzle.md) | Example 左右分栏展示 SQL + drizzle，都只读 |
| [0006](./adr/0006-curriculum-lives-in-backend.md) | Curriculum 内容（Markdown + Examples + Seed）全在后端 |
| [0007](./adr/0007-drizzle-dsl-preferred-sql-template-fallback.md) | drizzle DSL 优先，不支持的回落 `sql\`...\`` 模板 |
| [0008](./adr/0008-curriculum-module-content-structure.md) | 教学 Module 内容结构：定义 + 语法骨架 + Example 变体 +（复杂主题）mermaid 图，禁废话 |

## 实现状态（2026-05-12 暂停）

| 阶段 | 状态 |
|---|---|
| 根目录配置（pnpm workspace / .gitignore / tsconfig.base） | ✅ 完成 |
| Docker PG（docker-compose.yml + init.sql） | ✅ 完成 |
| 后端骨架（db.ts / index.ts / routes/modules.ts / types） | ✅ 完成 |
| CRUD 模块 curriculum（index.md / schema.ts / seed.sql / 5 个 examples） | ✅ 完成 |

**何时恢复**：
1. `pnpm install` 一次性把根目录 + apps/api + apps/web 依赖装好
2. `pnpm db:up` 启动 PG（首次会跑 init.sql 创建 app 角色）
3. `pnpm dev:api` 单独跑后端，curl 测：
   ```bash
   curl -X POST http://localhost:3001/api/modules/curd/ensure
   curl http://localhost:3001/api/modules/curd
   curl -X POST http://localhost:3001/api/modules/curd/exec \
     -H 'content-type: application/json' \
     -d '{"exampleId":"select-all"}'
   ```
4. 后端确认能通后再补前端（剩余文件清单见 TaskList 任务 #5）

## 教学写作约定（ADR-0008 速查）

每个 Module 的每个 Section 强制结构：

1. **定义段** 3-5 句，目标 < 120 字。讲事实，不讲行业经验。
2. **`### 语法骨架`** ASCII placeholder block + 每条子句一条 bullet。
3. **多个 Example 变体** —— 简单 1-3 个、复杂 5-8 个；每个变体一个 `:::example{id="..."}` 占位，**不加 `### <短标题>`**（卡片自己渲染 `ExampleDef.title`），占位下不写解释段。
4. **mermaid 图**（仅复杂主题）—— 在骨架之后、Example 之前嵌入。JOIN/CTE/MVCC/事务隔离/索引/查询计划这类。Web 端 mermaid 集成在第一个用图的 Module 才做。
5. 对于常用sql优化或者最佳实践的写法，可以在最后补充。

明确**不**写：易错点小节、性能 side-note、Example 占位前的 `### 短标题`、占位下的解释段、UI 控件描述。

参考样板：`apps/api/src/curriculum/basic/curd/index.md` 的 SELECT 节。

## 已识别但延后处理的事项

| 议题 | 现状 | 下次再开 |
|---|---|---|
| 余下 24 个 Module 的内容 | 未开始 | walking skeleton 跑通后逐个填 |
| 高级阶段中 drizzle 完全不涉及的主题（VACUUM / 复制 / WAL / 备份） | UI 已支持 `support: 'none'` | 该类 Module 编写时按需用 sql 模板 |
| 多用户 / 部署上线 | 不在范围 | 如果未来要公开，必须重审 [[0002]] |
| 中文全文搜索（pg_trgm / 中文分词扩展） | 大纲提到 | 实现到全文搜索 Module 时再调研扩展安装 |
| EXPLAIN ANALYZE 大表性能演示 | 需要 1 万行级数据 + 30s 超时 | 实现「索引」Module 时按例外提升 timeout |
| `partial` Module 真实占比 | 估算"绝大多数高级主题"，但具体到 Example 粒度未审计 | 实现各 Module 时滚动确认 |
| mermaid 集成（图渲染） | ADR-0008 选了 mermaid，但未集成 | 第一个复杂主题模块（JOIN 等）开写前加 markdown-it-mermaid + mermaid 包 |
| Markdown 热重载 | `index.md` 改动需重启 API（tsx watch 默认不看 .md） | 铺剩余模块前修：要么 tsx watch 加 `--include '**/*.md'`，要么 markdown 改为按请求 fs.readFile |
