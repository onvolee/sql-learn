## 决策

每个 Module 内每个 Section 必含的元素，按出现顺序：

1. **定义段**（必填，3-5 句）—— 这个功能是什么、做什么、返回什么形状的结果。**只讲事实，不讲行业经验**。
2. **`### 语法骨架`**（必填）—— ASCII placeholder 代码块（如 `SELECT <columns> FROM <table>`）+ 每个 placeholder 一条 bullet 解释允许的取值。
3. **多个 Example 变体**（必填，按主题决定数量，简单 1-3 个，复杂 5+）—— 每个变体一个 `:::example{id="..."}` 占位，**不要**在前面加 `### <短标题>`（卡片头部已渲染 `ExampleDef.title`，重复一遍视觉冗余）。短标题写在 `ExampleDef.title` 字段里。占位下不写解释段。
4. **mermaid 关系图**（仅复杂主题加）—— 在语法骨架之后、Example 之前嵌入。`JOIN`、`CTE`、`MVCC`、`事务隔离`、`索引 B-tree`、`查询计划`、`复制拓扑` 这类需要可视化的主题用。简单 CRUD 类不加。

# 教学 Module 的图示规则

写 `apps/api/src/curriculum/**/index.md` 时，怎么画"语法骨架 / 关系图"分两步：①按子节内容形态选工具（ASCII vs mermaid）；②写 mermaid 时机械避三个坑。

## 1. ASCII vs mermaid：按子节内容形态分流

beautiful-mermaid 是渲染器，把丑 mermaid 渲染漂亮，**不会把不该画图的内容变得该画图**。所以工具选择先于美化。

| 内容形态 | 工具 | 例子 |
|---|---|---|
| 线性子句序列（顺序固定 + 可选标记） | **ASCII** ` ```text ` | SELECT / UPDATE / DELETE 子句、WHERE 整体语法位置、VACUUM 选项行 |
| 有分支 / 多形态 / 条件路径 | **mermaid** | INSERT ... ON CONFLICT DO NOTHING/UPDATE、WHERE predicate 各种形态枚举 |
| 关联 / 关系 / 多对象 | **mermaid** | JOIN（两/多表）、外键关系、Schema 拓扑 |
| 状态机 / 转换 | **mermaid** (`stateDiagram-v2`) | MVCC 行版本可见性、事务隔离级别、连接池状态 |
| 树形 / 递归 / 层级 | **mermaid** | CTE、子查询嵌套、索引 B-tree、查询计划 EXPLAIN |

**粒度是子节，不是 Module**。同一 Module 内不同子节可以混用——CRUD 模块就是 SELECT/UPDATE/DELETE 用 ASCII，INSERT/WHERE 用 mermaid。

> 本规则细化 [[docs/adr/0008-curriculum-module-content-structure.md]] 的"简单 CRUD 不加 mermaid"——粒度从 Module 改为子节。

## 2. Mermaid 写作三个坑

beautiful-mermaid 渲染管道挂在 `apps/web/src/markdown.ts` 的 `md.renderer.rules.fence` 覆盖里。写 ```mermaid 块时机械执行：

### 坑 1：`|` 在 node label 里会被吞

Mermaid 把 `|` 当成 edge label 分隔符（`A -->|label| B`），即使写在 `["..."]` 引号里也会断。后半段连同结尾 `"]` 一起丢失，前面的 `"` 反而被当成字面字符显示。

- ❌ `O["ORDER BY <key> [ASC|DESC]"]` → 渲染成 `"ORDER BY <key> [ASC|DESC`
- ✅ HTML entity：`O["ORDER BY <key> [ASC&#124;DESC]"]`
- ✅ 换符号（教学语境通常更易读）：`O["ORDER BY <key> [ASC/DESC]"]`

### 坑 2：`<` `>` 必须用 HTML entity

label 里直接写 `<columns>` mermaid 会吞掉尖括号。用 `&lt;columns&gt;`。

### 坑 3：mermaid 渲染必须走 fence rule，不要走 highlight 钩子

markdown-it 默认 fence renderer 检查 `highlight` 钩子返回值是否以 `<pre` 开头——**不是**的话会再用 `<pre><code>` 包一层 + 转义内容。所以 mermaid → SVG 必须在 `md.renderer.rules.fence` 里覆盖整条 fence 规则。

已在 `apps/web/src/markdown.ts` 实现；后续扩 markdown 集成时不要把 mermaid 分支搬回 highlight 钩子，否则页面会看到 mermaid 源码而不是 SVG。

## 写 mermaid 块的 checklist

1. 这一节真的要画图吗？（对照第 1 节表格）—— 不要默认要画
2. label 里有 `<` `>` `|` 吗？—— 全换 entity 或同义符号
3. `apps/web/src/markdown.ts` 的 mermaid fence 覆盖还在吗？—— 别误删
