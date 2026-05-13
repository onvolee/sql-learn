# 章节生成任务：7. 约束

> **Agent 开工前必读**：`docs/chapter-template/chapter-template.md`
> 本文件只提供本章节的具体决策与任务清单。

## 章节基本信息

| 字段 | 值 |
|---|---|
| 大纲来源 | `postgresql-study-outline.md` → 「一、入门阶段 → 7. 约束」 |
| group | `basic` |
| slug | `constraint` |
| schema | `m_constraint` |
| order | 7 |
| 读者画像 | 零 SQL 基础，已看过 ch01（PK/FK 基础概念）+ ch05 |

## 教学边界

- 覆盖大纲列出的 6 类约束：PK、FK、UNIQUE、NOT NULL、CHECK、DEFAULT、DEFERRABLE
- PK/FK 在 ch01 已讲基础，本章**只补「复合主键」「ON DELETE / ON UPDATE 动作」**
- 不展开：EXCLUDE 约束、RLS（→ ch15）、触发器实现的约束（→ ch12）

## 任务清单

### Task 1 — 写 `schema.ts`

`orders` + `order_items` 演示**复合主键**和**外键级联**：
- `orders(id serial PK, customer text NOT NULL, status text NOT NULL DEFAULT 'pending', total numeric(10, 2) CHECK (total >= 0))`
- `order_items(order_id int REFERENCES orders(id) ON DELETE CASCADE, line_no int, product text NOT NULL, qty int NOT NULL CHECK (qty > 0), PRIMARY KEY (order_id, line_no))`

### Task 2 — 写 `seed.sql`

- `orders` 4 行（status 至少含 'pending' / 'paid' 各一行；一行 total = 0 测 CHECK 边界）
- `order_items` 8 行（覆盖 4 个 order，每单 1-3 行）
- 全部 `ON CONFLICT DO NOTHING`

### Task 3 — 写 Section 1：PRIMARY KEY 与 FOREIGN KEY（复合 + 级联）

- **定义段要点**：PK 唯一标识一行（复习自 ch01） / 复合主键 = 多列组合唯一 / FK 引用另一表的 PK / `ON DELETE CASCADE` 删主行连带删子行 / `ON UPDATE` 同理
- **语法骨架**：ASCII，`PRIMARY KEY (<col1>, <col2>)` + `REFERENCES <t>(<c>) ON DELETE <action>`
- **mermaid**：加。画 `order_items.(order_id, line_no) → orders.id` 复合 PK + FK 关系
- **Examples**：
  - `pk-composite-violation` — 同 (order_id, line_no) 重复插入，期望 23505；`support: 'partial'`
  - `fk-cascade-delete` — 先确认 order_id=1 有 items，再 `DELETE FROM orders WHERE id = 1` 然后 `SELECT count(*) FROM order_items WHERE order_id = 1` = 0；`support: 'partial'`（注：example 末尾把删的 order 重新插回，保证下次跑数据回到初态——或用 SAVEPOINT + ROLLBACK TO）

### Task 4 — 写 Section 2：UNIQUE 与 NOT NULL

- **定义段要点**：`NOT NULL` 列不允许空 / `UNIQUE` 列值不重复（NULL 算「未知」不冲突，PG 默认 NULL 不视为相等） / 多列 UNIQUE = 组合不重复 / `UNIQUE NULLS NOT DISTINCT`（PG 15+）允许把 NULL 视为冲突
- **语法骨架**：ASCII，列级和表级 UNIQUE 两种写法
- **mermaid**：不加
- **Examples**：
  - `not-null-violation` — `INSERT INTO orders (customer) VALUES (NULL)` 期望 23502；`support: 'partial'`
  - `unique-violation` — 用临时 UNIQUE 列演示（`ALTER TABLE orders ADD CONSTRAINT IF NOT EXISTS uq_customer UNIQUE (customer)` 然后插重复 customer，期望 23505；结尾清理）；`support: 'partial'`
  - `unique-nulls-allowed` — 演示 UNIQUE 列允许多个 NULL（默认 NULLS DISTINCT 行为）；`support: 'partial'`

### Task 5 — 写 Section 3：CHECK 与 DEFAULT

- **定义段要点**：`CHECK (<expr>)` 行级断言 / 表达式必须返回 boolean / 不满足时 INSERT/UPDATE 被拒（23514） / `DEFAULT <expr>` 列默认值，INSERT 不给该列时用
- **语法骨架**：ASCII，`<col> <type> CHECK (<expr>) DEFAULT <expr>`
- **mermaid**：不加
- **Examples**：
  - `check-violation-negative-total` — 插入 `total = -1` 期望 23514；`support: 'partial'`
  - `check-violation-zero-qty` — `order_items` 插 `qty = 0` 期望 23514；`support: 'partial'`
  - `default-status-pending` — 插入 order 不给 status，看到值 = 'pending'；drizzle DSL；`support: 'full'`

### Task 6 — 写 Section 4：DEFERRABLE — 延迟约束

- **定义段要点**：默认约束 = 语句级立刻检查 / `DEFERRABLE INITIALLY IMMEDIATE/DEFERRED` 允许延后到事务提交时再检查 / 主要用于「环形外键」「交换主键」等特殊场景
- **语法骨架**：ASCII，`ADD CONSTRAINT ... DEFERRABLE INITIALLY DEFERRED` + `SET CONSTRAINTS <name> DEFERRED`
- **mermaid**：不加
- **Examples**：
  - `deferrable-swap-keys` — 在一个 example 内：临时把某 FK 设为 deferrable + 交换两行的引用值 + 验证事务结束时通过；`support: 'partial'`（涉及 ALTER + SET CONSTRAINTS + UPDATE，注意末尾还原 ALTER）

### Task 7 — 写 `index.ts`

`examples` 数组 10 个。

### Task 8 — 注册到 `registry.ts`

## 完成验收 Checklist

### 内容边界
- [ ] 4 个 Section 主语依次为：PK/FK（复合+级联）、UNIQUE/NOT NULL、CHECK/DEFAULT、DEFERRABLE
- [ ] PK/FK 基础部分不重复 ch01 内容（只补复合 + 级联）
- [ ] 未出现 EXCLUDE 约束、RLS、触发器实现约束

### Schema / Seed
- [ ] `order_items` 用 `PRIMARY KEY (order_id, line_no)` 复合主键
- [ ] `orders` 含 `CHECK (total >= 0)` 和 `DEFAULT 'pending'`
- [ ] FK 用 `ON DELETE CASCADE`

### 关键 Example 行为
- [ ] `pk-composite-violation` 返回 23505
- [ ] `not-null-violation` 返回 23502
- [ ] `check-violation-negative-total` 返回 23514
- [ ] `default-status-pending` 返回的行 status = 'pending'
- [ ] `fk-cascade-delete` example 跑完后表数据回到初态（自洽）

### 重入安全
- [ ] `unique-violation` 中的 `ADD CONSTRAINT` 用 `IF NOT EXISTS`，例末 `DROP CONSTRAINT IF EXISTS`
- [ ] `deferrable-swap-keys` 的 ALTER 操作有对应还原
