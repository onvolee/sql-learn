# SQL Learn

**中文** · [English](./README.en.md)

## 项目背景

**SQL Learn** 是一个本地运行的交互式 PostgreSQL 自学教程站点。

PostgreSQL 生态里手册和零散博客很多，但很少有"读完解释能立刻在同一页面跑真实 SQL 拿到结果"的体验。这个项目就是为此而生：

- 每个知识点（比如 `JOIN`、窗口函数、MVCC、索引）是一个独立的 **Module**，自带教程文字、可运行的代码示例，以及独占的 PostgreSQL schema（`m_<slug>`），各 Module 互不污染。
- 每个 Example 都**并排展示两份代码**：原生 SQL 和等价的 [`drizzle-orm`](https://orm.drizzle.team/) 写法——既能学 SQL,也能看现代 TypeScript ORM 如何映射到 SQL。drizzle 无法原生表达的部分会打标签,提示这里走 `sql\`...\`` 模板。
- 点击 **运行** 会把示例发送到本地的 PostgreSQL 18（Docker 启动）真实执行，结果直接以表格渲染在页面上。

技术栈：前端 Vue 3 + Element Plus；后端 Hono + drizzle-orm + `pg`；数据库 PostgreSQL 18-alpine（Docker）。

## 安装指南

### 前置依赖

- [Node.js](https://nodejs.org/) ≥ 24
- [pnpm](https://pnpm.io/)（项目通过 `packageManager` 字段锁定 `pnpm@11.1.0`，`corepack enable` 即可）
- [Docker](https://www.docker.com/)（用于启动 PostgreSQL 容器）

### 步骤

```bash
# 1. 克隆
git clone git@github.com:onvolee/sql-learn.git
cd sql-learn

# 2. 安装依赖（monorepo）
pnpm install

# 3. 配置 API 的 env 文件
cp apps/api/.env.example apps/api/.env

# 4. 启动 PostgreSQL（宿主机 54322 端口映射到容器 5432）
pnpm db:up

# 5. 并行启动 API（:3001）和前端（:5173）
pnpm dev
```

浏览器打开 <http://localhost:5173>。Vite dev server 会把 `/api/*` 反向代理到 Hono 后端。

### 常用脚本

| 命令 | 作用 |
|---|---|
| `pnpm dev` | 同时启动 API 和前端 |
| `pnpm dev:api` / `pnpm dev:web` | 只启动其中一边 |
| `pnpm db:up` / `pnpm db:down` | 启动 / 停止 PostgreSQL 容器 |
| `pnpm db:reset` | 清空 PG 数据卷并重启（重新跑初始化 SQL） |
