# SQL Learn

一个用于系统性自学 PostgreSQL 的本地交互式教程站。每个学习节点是一个独立的"模块"，包含教程文字、SQL 代码示例、drizzle-orm 等价写法，点击"运行"会对接真实的本地 PostgreSQL 实例返回结果。

## Language

**Module**:
一个学习单元，对应 `postgresql-study-outline.md` 大纲里的一个叶子节点（如「JOIN 高级查询」「窗口函数」「索引」）。一个 Module 在前端是一条 vue-router 路由，在 PostgreSQL 里是一个独立 schema。
_Avoid_: chapter, lesson, page, section

**Module slug**:
Module 的稳定标识符，kebab-case。同时是路由路径片段、Markdown 文件夹名，以及 PostgreSQL schema 名（带 `m_` 前缀）的来源。例如 slug `joins` → 路由 `/intermediate/joins` → PG schema `m_joins`。
_Avoid_: module id, module key, module name

**Example**:
Module 内一个可运行的代码示例单元，包含一对展示用代码块（SQL 写法 + drizzle 写法）和一个真实执行的后端函数。前端用 Markdown 自定义指令 `:::example{id="..."}` 占位，后端用 `examples/<id>.ts` 实现执行逻辑。
_Avoid_: code block, snippet, demo

**Support tier**:
一个 Example 对 drizzle-orm 支持程度的分级：`full`（drizzle DSL 原生可表达）/ `partial`（需要混用 `sql\`...\`` 模板）/ `none`（drizzle 不涉及，仅展示 SQL）。直接驱动 UI 的徽章和 drizzle pane 的可用状态。
_Avoid_: drizzle compatibility, drizzle support level

**Tutorial**:
一个 Module 内除 Example 之外的散文讲解部分，写在 `index.md` 里，包裹和串联 Example。
_Avoid_: explanation, narrative, content

**Seed**:
让一个 Module 可用所需的前置状态——`m_<slug>` schema 本身 + 必要的演示表 + 演示数据。Seed 用纯 SQL 文件 `seed.sql` 表达，因为 Module 第一节课就是教用户认识 SQL 本身。
_Avoid_: fixtures, initial data, bootstrap

**Schema** (注意歧义):
本项目中"schema"一词有两种含义，**必须根据语境判断**：
- **PG schema**: PostgreSQL 命名空间。每个 Module 拥有一个 PG schema `m_<slug>`，所有该模块的表都在这个 schema 下。
- **drizzle schema**: drizzle-orm 的 `pgTable(...)` 定义文件，描述表结构以便 DSL 调用。

## Relationships

- 一个 **Module** 拥有 1 个 PG schema（`m_<slug>`），0-N 个 **Example**，1 份 **Seed**，1 份 **Tutorial**
- 一个 **Example** 属于唯一一个 **Module**，并声明唯一一个 **Support tier**
- 一个 **Module** 在前端表现为一条路由，在后端表现为 `apps/api/src/curriculum/<group>/<slug>/` 目录

## Example dialogue

> **Dev:** "「窗口函数」这个 Module 里的 RANK 那个 Example，drizzle 怎么写？"
>
> **Domain expert:** "drizzle 不能原生表达 `OVER (PARTITION BY ...)`，所以 Support tier 是 `partial`——drizzle pane 展示用 `sql\`...\`` 模板的混写法，并在顶部加黄色徽章。底层 execute 函数也是 `db.execute(sql\`RANK() OVER (...)\`)`。"

## Flagged ambiguities

- "schema" 同时指 PG schema 和 drizzle schema。约定：单独写 "schema" 默认指 PG schema；指代 drizzle 的表定义文件时必须说 "drizzle schema" 或 "pgTable 定义"。
