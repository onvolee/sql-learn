# SQL Learn

[中文](./README.md) · **English**

## Background

**SQL Learn** is a local, interactive tutorial site for systematically self-studying PostgreSQL.

The PostgreSQL ecosystem has plenty of reference docs and scattered blog posts, but few resources let you *read an explanation and immediately run the SQL against a real database* without leaving the page. This project fills that gap:

- Each topic (e.g. `JOIN`, window functions, MVCC, indexes) is a self-contained **Module** with its own tutorial prose, runnable code examples, and an isolated PostgreSQL schema (`m_<slug>`) so examples never collide.
- Every example is shown **twice side-by-side**: as raw SQL and as the equivalent [`drizzle-orm`](https://orm.drizzle.team/) query — making this useful both for learning SQL and for learning how a modern TypeScript ORM maps onto it. Examples that drizzle can't natively express are tagged so you know to read the `sql\`...\`` template form.
- Hitting **Run** executes the example against a local PostgreSQL 18 instance (in Docker) and renders the actual result rows in the page.

Stack: Vue 3 + Element Plus on the frontend, Hono + drizzle-orm + `pg` on the backend, PostgreSQL 18-alpine in Docker.

## Installation

### Prerequisites

- [Node.js](https://nodejs.org/) ≥ 24
- [pnpm](https://pnpm.io/) (project pins `pnpm@11.1.0` via the `packageManager` field — `corepack enable` is enough)
- [Docker](https://www.docker.com/) (for the PostgreSQL container)

### Steps

```bash
# 1. Clone
git clone git@github.com:onvolee/sql-learn.git
cd sql-learn

# 2. Install dependencies (monorepo)
pnpm install

# 3. Configure the API env file
cp apps/api/.env.example apps/api/.env

# 4. Start PostgreSQL (host port 54322 -> container 5432)
pnpm db:up

# 5. Start API (:3001) and web (:5173) in parallel
pnpm dev
```

Open <http://localhost:5173> — the Vite dev server proxies `/api/*` to the Hono backend.

### Useful scripts

| Command | What it does |
|---|---|
| `pnpm dev` | Run API and web in parallel |
| `pnpm dev:api` / `pnpm dev:web` | Run one side only |
| `pnpm db:up` / `pnpm db:down` | Start / stop the PostgreSQL container |
| `pnpm db:reset` | Wipe the PG volume and restart (re-runs init SQL) |
