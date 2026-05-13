// @ts-nocheck
//
// ExampleDef 代码样板。AI 写新章节 example 时复制对应分支并改占位。
//
// 本文件**不参与构建**，只作为参照源，AI 读它就能写出合法的 examples/<id>.ts。
// 真实 example 文件放在 apps/api/src/curriculum/<group>/<slug>/examples/<id>.ts。
//
// 三种 support tier（详见 docs/adr/0007-drizzle-dsl-preferred-sql-template-fallback.md）：
//   - 'full'    —— drizzle DSL 能直接表达：CRUD、JOIN、WHERE、子查询、聚合等
//   - 'partial' —— drizzle DSL 不支持或要绕大圈，回落 db.execute(sql`...`)：DDL、窗口函数、
//                  LATERAL、JSONB 操作符、CTE、集合运算等
//   - 'none'    —— 主题与 drizzle 完全无关：VACUUM、EXPLAIN、pg_stat、WAL、复制、备份、psql 元命令
//
// 字段约定：
//   - id           kebab-case，形如 <动作>-<细节>，必须与 index.md 里 :::example{id="..."} 完全一致
//   - title        短标题，与 index.md 子标题对得上
//   - support      'full' | 'partial' | 'none'
//   - display.sql      左侧展示的纯 SQL（学生看的，不参与执行）
//   - display.drizzle  右侧展示的 drizzle 写法字符串；'none' 时填空串 '' (前端渲染占位)
//   - execute      真实跑的函数；'none' 也要写（用 sql 模板），UI "运行" 按钮才可用；
//                  彻底不可运行时省略 execute（UI 自动禁用按钮）
//   - timeoutMs    覆盖默认 5000ms 的语句超时；EXPLAIN ANALYZE 大表等用

import { sql, eq } from 'drizzle-orm';
import type { ExampleDef } from '../../apps/api/src/curriculum/types.ts';
import { users } from '../../apps/api/src/curriculum/basic/curd/schema.ts';
// ↑ 占位 import；新章节请改成 import { users } from '../schema.ts'（相对自己 module 的路径）

// ──────────────────────────────────────────────────────────────────────
// 样板 1：support: 'full' —— drizzle DSL 优先
// ──────────────────────────────────────────────────────────────────────
const fullExample: ExampleDef = {
  id: 'select-where-eq',
  title: '等值过滤',
  support: 'full',
  display: {
    sql: `SELECT id, name
FROM users
WHERE id = 1;`,
    drizzle: `import { eq } from 'drizzle-orm';
import { users } from './schema';

await db
  .select({ id: users.id, name: users.name })
  .from(users)
  .where(eq(users.id, 1));`,
  },
  execute: (db) =>
    db
      .select({ id: users.id, name: users.name })
      .from(users)
      .where(eq(users.id, 1)),
};

// ──────────────────────────────────────────────────────────────────────
// 样板 2：support: 'partial' —— drizzle DSL 不支持，回落 sql 模板
// 注意 display.drizzle 字符串和 execute() 函数语义必须一致：文字展示什么，底层就跑什么
// ──────────────────────────────────────────────────────────────────────
const partialExample: ExampleDef = {
  id: 'window-row-number',
  title: 'ROW_NUMBER 窗口函数',
  support: 'partial',
  display: {
    sql: `SELECT id, name,
       row_number() OVER (ORDER BY id) AS rn
FROM users;`,
    drizzle: `import { sql } from 'drizzle-orm';
import { users } from './schema';

await db.execute(sql\`
  SELECT id, name,
         row_number() OVER (ORDER BY id) AS rn
  FROM \${users}
\`);`,
  },
  execute: (db) =>
    db.execute(sql`
      SELECT id, name,
             row_number() OVER (ORDER BY id) AS rn
      FROM ${users}
    `),
};

// ──────────────────────────────────────────────────────────────────────
// 样板 3：support: 'none' —— 完全与 drizzle 无关；drizzle pane 显示占位
// ──────────────────────────────────────────────────────────────────────
const noneExample: ExampleDef = {
  id: 'explain-seq-scan',
  title: 'EXPLAIN 全表扫描',
  support: 'none',
  display: {
    sql: `EXPLAIN SELECT * FROM users WHERE name LIKE 'a%';`,
    drizzle: '', // 'none' 时前端渲染灰色占位"drizzle 不涉及此主题"
  },
  execute: (db) =>
    db.execute(sql`EXPLAIN SELECT * FROM users WHERE name LIKE 'a%'`),
};

// ──────────────────────────────────────────────────────────────────────
// 样板 4：timeoutMs 覆盖默认 5s —— EXPLAIN ANALYZE 大表场景
// ──────────────────────────────────────────────────────────────────────
const longRunningExample: ExampleDef = {
  id: 'explain-analyze-big',
  title: 'EXPLAIN ANALYZE 1 万行',
  support: 'none',
  timeoutMs: 30000,
  display: {
    sql: `EXPLAIN ANALYZE SELECT count(*) FROM events;`,
    drizzle: '',
  },
  execute: (db) =>
    db.execute(sql`EXPLAIN ANALYZE SELECT count(*) FROM events`),
};

export { fullExample, partialExample, noneExample, longRunningExample };
