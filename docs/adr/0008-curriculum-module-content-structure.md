# ADR-0008: 教学 Module 的内容结构定为"定义 + 语法骨架 + Example 变体 + 复杂主题加 mermaid 图"

## 背景

第一版 CRUD 模块（[[0006-curriculum-lives-in-backend]] 落盘）每节只有「一句话引导 + 一个可运行 Example」。用户跑通后反馈：

> "你只是把一些 sql 列出来，执行一下就没了，完全没有教学的内容在里面。"

需要确定一个**所有 25+ Module 通用的内容结构**，否则铺其他主题时质量飘移，事后回炉成本巨大。

## 决策

每个 Module 内每个 Section 必含的元素，按出现顺序：

1. **定义段**（必填，3-5 句）—— 这个功能是什么、做什么、返回什么形状的结果。**只讲事实，不讲行业经验**。
2. **`### 语法骨架`**（必填）—— ASCII placeholder 代码块（如 `SELECT <columns> FROM <table>`）+ 每个 placeholder 一条 bullet 解释允许的取值。
3. **多个 Example 变体**（必填，按主题决定数量，简单 1-3 个，复杂 5+）—— 每个变体一个 `:::example{id="..."}` 占位（**不要**在前面加 `### <短标题>`，卡片头部已渲染 `ExampleDef.title`，重复一遍视觉冗余）。短标题写在 `ExampleDef.title` 字段里。占位下不写解释段（卡片标题 + SQL/drizzle 双列代码已表达足够信息）。
4. **mermaid 关系图**（仅复杂主题加）—— 在语法骨架之后、Example 之前嵌入。`JOIN`、`CTE`、`MVCC`、`事务隔离`、`索引 B-tree`、`查询计划`、`复制拓扑` 这类需要可视化的主题用。简单 CRUD 类不加。

### 明确**不**写的内容

| 不写 | 理由 |
|---|---|
| 易错点 / 反例小节 | 用户明确不要；练习/踩坑通过 Example 实操体验 |
| ORM 对比表 / 跨技术栈对照 | 同上 |
| 性能调优 side-note（"深翻页 OFFSET 慢，那是另一个故事"） | 把节凑大、稀释主题；属于 [[废话]] |
| Example 占位前的 `### <短标题>` | 卡片头部已渲染 `ExampleDef.title`，重复一遍视觉冗余 |
| Example 占位下的解释段 | 卡片标题 + 双列代码已自解释 |
| UI 控件描述（"点右上角重置..."） | UI 自己应该靠 tooltip 介绍 |

### 最后补充

1. 对于常用sql功能或语法给出行业最佳实践和经验。
2. 对于经常容易出现问题的语法或功能做出补充提醒。

### 字数 / 篇幅

- 定义段：3-5 句，目标 < 120 字
- 语法骨架：ASCII block + 同子句数量的 bullet（每条 ≤ 30 字）
- Example 数量：简单（SELECT 基本变体）3-5 个；复杂（JOIN 各种、CTE）5-8 个；纯 PG 内部主题（VACUUM）0 个可执行 + 用 sql 模板示意
- 复杂主题如有 mermaid 图：1 张主图为主，必要时 2 张

## 参考样板

`apps/api/src/curriculum/basic/curd/index.md` 的 SELECT 节是第一份参考实现，5 个变体（select-all / select-cols / select-order-desc / select-limit / select-expr）。任何新模块照它的结构骨架来写。
