# ADR-0005: 每个 Example 同时展示 SQL 和 drizzle 两份代码（左右只读分栏）

- **状态**: Accepted
- **日期**: 2026-05-12

## 背景

`learn.md` 把 drizzle-orm 列进技术栈，但 `postgresql-study-outline.md` 全是 SQL/PG 主题。drizzle 在项目里到底干什么、怎么展示，需要一个统一答案。

候选：

- **A. drizzle 只做"管道"，不教** —— 学习者完全看不到 drizzle
- **B. drizzle 独立成区** —— 大纲三阶段全走 SQL；侧菜单加一栏「drizzle-orm 篇」
- **C. 每个 Module 双语对照** —— Example 同时展示 SQL + drizzle 两种写法
- **D. 移除 drizzle** —— 后端直接用 `pg` 驱动

## 决策

选择 **C**：

- 每个 Example 区域**左右分栏**：drizzle pane 在左，SQL pane 在右
- **两个 pane 都只读**，不允许用户编辑（用户决定）
- 右下角"运行"按钮触发后端执行；结果展示在示例区下方
- 每个 Example 声明一个 **Support tier**（见 [[CONTEXT.md]]）：
  - `full`：drizzle DSL 原生可表达，drizzle pane 正常展示
  - `partial`：drizzle DSL 不直接支持，需用 `sql\`...\`` 模板字符串；pane 顶部加黄色徽章
  - `none`：drizzle 不涉及（VACUUM / pg_stat / 复制 / WAL / 备份恢复）；drizzle pane 替换为灰色提示框

## 理由

- 用户明确表达："想看见 SQL 和 drizzle 怎么映射"——核心教学诉求
- **C 的开发量虽然翻倍**（每个 Example 两份代码），但相对总工作量仍可控，因为每个 Example 的两份代码都是预写字符串，不是动态生成
- drizzle 不支持的高级主题，UI 用徽章和占位提示**显式说明不支持**，反而强化了"为什么需要懂底层 SQL"的教学意图
- 都只读极大简化了安全模型：前端不暴露任何 SQL 输入框，devtools 攻击面降到只能调用预定义的 `exampleId`

## 后果

- 每个 Example 实际定义包含三部分：`display.sql`、`display.drizzle`、`execute(db)` 函数（见 [[0007-drizzle-dsl-preferred-sql-template-fallback]]）
- DDL Example（CREATE/ALTER/DROP）的 Support tier 默认为 `partial`，因为 drizzle DSL 不直接支持 DDL，必须走 `sql\`...\``
- "可编辑 + 可运行"模式（用户写自己的 SQL/drizzle 跑）作为未来 nice-to-have，不在 v1 范围
- 跨模块共用的"代码示例区"组件 `<CodeExample>` 是前端核心展示部件，所有 25+ Module 通用

## 备选未选

- **A (drizzle 隐藏)** 被否：用户明确想学 drizzle
- **B (drizzle 独立区)** 被否：用户想要的是"同一查询的两种写法对照"，B 把两者分离反而看不到映射
- **D (移除 drizzle)** 被否：与 `learn.md` 技术栈矛盾，且用户想学 drizzle
