# ADR-0006: Curriculum 内容（Markdown + Examples + Seed）全部存放在后端

- **状态**: Accepted
- **日期**: 2026-05-12

## 背景

由 [[0005-dual-display-sql-and-drizzle]] 和 [[0007-drizzle-dsl-preferred-sql-template-fallback]] 决定后，每个 Example 包含一个**执行函数** `execute(db)`，其中可能调用 drizzle DSL（需要引用 drizzle schema 定义）。这意味着 Example 不能仅是静态字符串，必须是后端 TypeScript 代码。

随之引出一个分歧：**教程 Markdown 文字（Tutorial）** 应该和 Example 在一起放后端，还是仍按 v1 的想法放前端用 `:::example` 指令引用后端？

候选：

- **a. Markdown 在前端，Example 元数据由前端拉取** —— 前端 `:::example{id="foo"}` 指令拉取后端 `/api/examples/foo`
- **b. Markdown 和 Example 都在后端，前端拉整体内容** —— 前端调 `GET /api/modules/:slug` 拿到 markdown + examples 元数据，渲染时把 `:::example` 替换为组件
- **c. Markdown 在后端，构建期同步生成前端版本** —— 引入构建步骤

## 决策

选择 **b**：所有 Curriculum 内容物理上都放在 `apps/api/src/curriculum/<group>/<slug>/`：

```
apps/api/src/curriculum/basic/curd/
├── index.md          ← Tutorial 散文，含 :::example{id=...} 占位
├── schema.ts         ← drizzle pgTable 定义（属于 m_<slug>）
├── seed.sql          ← 模块前置状态（DML 模块预建表+插数据；DDL 模块极少/空）
└── examples/
    ├── index.ts      ← 汇总导出 examples 数组
    ├── select-all.ts ← { id, support, display: {sql, drizzle}, execute }
    └── ...
```

前端 API：
- `GET /api/modules` → 菜单数据
- `GET /api/modules/:slug` → `{ markdown, examples: [{id, support, display, runnable}] }`
- `POST /api/modules/:slug/ensure | reset | exec`

前端 Vue 是纯渲染器：拉数据 → 用 markdown-it 渲染 Markdown，在 `:::example` 位置挂载 `<CodeExample>` 组件。

## 理由

1. **Example 的执行函数本来就是后端 TS 代码**——它需要 import drizzle schema、引用 `pgTable` 实例。这部分无法搬到前端
2. **`display.sql` 和 `execute` 必须在同一文件里维护**——否则展示的 SQL 和实际执行的 drizzle 代码可能漂移。两者同源 = 单一事实来源
3. **Tutorial 文字和 Example 在同一目录维护**——增删/重排 Example 时，文档和代码一起改，diff 最小
4. **a 的代价**：Example 元数据跨前后端两边存，编辑体验差
5. **c 的代价**：引入构建步骤维护额外的同步逻辑，对单人项目过重

## 后果

- 修改任何 Tutorial 文字也要修改后端代码（不是"前端只是 UI"）——这反映了项目的本质：内容驱动而非交互驱动
- 前端 Vue 组件树很小，几乎只有 `App.vue` + `TutorialPage.vue` + `CodeExample.vue` 三个核心组件
- 新增 Module = 在 `apps/api/src/curriculum/<group>/` 下加一个目录 + 在 `registry.ts` 注册一条，无需动前端路由（路由由后端 `GET /api/modules` 驱动菜单生成）
- 后端代码不只是 API 服务，也是 **教学内容的载体**

## 备选未选

- **a (前端 markdown)** 被否：执行函数必须在后端，强行把 markdown 留前端会让单个 Example 跨两个文件维护
- **c (构建期同步)** 被否：单一来源 + 简单架构胜过工具链
