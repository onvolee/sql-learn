# 第三方库文档查询

写代码前要查最新文档，**不要凭训练数据写**。包的 API 和配置项有版本差异，训练数据可能过时。

## 触发场景

- 新增依赖
- 升级依赖（跨 major 必查）
- 写 API 调用 / 配置文件
- 调试时报错堆栈里出现某包名

## 优先级

1. **`.claude/skills/` 下的对应 skill**（首选）
   本仓库已装的相关 skill：`hono`、`postgresql-optimization`、`postgresql-code-review`、`vercel-react-best-practices`、`next-best-practices`、`vercel-composition-patterns`。如果命中，用 skill 不用 context7。

2. **context7 MCP**（次选，覆盖所有其他第三方库）
   ```
   mcp__context7__resolve-library-id  →  mcp__context7__query-docs
   ```
   本项目里典型走 context7 的：drizzle-orm、Vue、Vite、Element Plus、vue-router、pinia、markdown-it、pg、highlight.js。

3. **WebFetch / WebSearch**（兜底）
   仅当 skill 和 context7 都没覆盖时用，结果要交叉验证（至少看两处来源）。
