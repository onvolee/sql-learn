# 约束

**约束**是声明在表上的写入规则，PG 在 INSERT / UPDATE / DELETE 时强制检查，不满足就拒绝并返回特定的 SQLSTATE 错误码。本章覆盖六种最常用约束：`PRIMARY KEY` / `FOREIGN KEY` / `UNIQUE` / `NOT NULL` / `CHECK` / `DEFAULT`，以及一个特殊修饰符 `DEFERRABLE`。

本模块在 `m_constraint` schema 下预置了两张表：`orders`（4 行）和 `order_items`（8 行）。`order_items` 用 `(order_id, line_no)` 复合主键、`order_id` 外键 `ON DELETE CASCADE` 指向 `orders.id`。

## 1. PRIMARY KEY 与 FOREIGN KEY — 复合主键与级联

**主键**唯一标识一行；ch01 已讲过单列主键。本节补两点：一张表的主键可以由多列组合而成（**复合主键**），多列组合值在表内唯一。**外键** `REFERENCES <t>(<c>)` 声明本列值必须出现在另一张表的主键列里；当主行被删除时，子行的处理由 `ON DELETE <action>` 控制：`CASCADE` 连带删除子行，`RESTRICT` / `NO ACTION` 拒绝删除，`SET NULL` 把子列置空。`ON UPDATE` 同理，作用于主键列被修改时。

### 语法骨架

```text
CREATE TABLE <table> (
  <col1>  <type>,
  <col2>  <type>,
  <fk-col> <type> REFERENCES <other-table>(<other-pk>)
                  [ON DELETE <action>]
                  [ON UPDATE <action>],
  ...,
  PRIMARY KEY (<col1>, <col2>)
);
```

- `PRIMARY KEY (<col1>, <col2>)`：表级复合主键，组合值在表内唯一且非空
- `REFERENCES <other-table>(<other-pk>)`：外键引用另一表的主键或 UNIQUE 列
- `<action>`：`CASCADE` / `RESTRICT` / `NO ACTION`（默认）/ `SET NULL` / `SET DEFAULT`
- 单列主键写在列定义后（`<col> <type> PRIMARY KEY`）；多列必须用表级写法

```mermaid
erDiagram
  orders {
    int     id PK
    text    customer
    text    status
    numeric total
  }
  order_items {
    int  order_id PK_FK
    int  line_no  PK
    text product
    int  qty
  }
  orders ||--o{ order_items : "ON DELETE CASCADE"
```

:::example{id="pk-composite-violation"}

:::example{id="fk-cascade-delete"}

## 2. UNIQUE 与 NOT NULL — 唯一与非空

`NOT NULL` 声明列不允许空值，违反时返回 SQLSTATE 23502。`UNIQUE` 声明列值在表内不重复，违反时返回 23505。PG 默认把多个 NULL **视为不相等**（NULLS DISTINCT），所以 UNIQUE 列里可以同时存在多个 NULL；PG 15+ 可以用 `UNIQUE NULLS NOT DISTINCT` 把 NULL 也算作冲突。多列 UNIQUE 是组合不重复，单列允许重复。

### 语法骨架

```text
-- 列级
<col>  <type> NOT NULL UNIQUE

-- 表级
CREATE TABLE <table> (
  <col1>  <type>,
  <col2>  <type>,
  ...,
  UNIQUE (<col1>, <col2>) [NULLS [NOT] DISTINCT]
);

-- 追加 / 删除
ALTER TABLE <table> ADD CONSTRAINT <name> UNIQUE (<col>);
ALTER TABLE <table> DROP CONSTRAINT <name>;
```

- `NOT NULL`：列级修饰符，禁止该列为空
- `UNIQUE (<col1>, <col2>)`：组合值在表内唯一
- `NULLS NOT DISTINCT`（PG 15+）：把 NULL 视为相等，禁止多 NULL
- `ALTER TABLE ... ADD CONSTRAINT`：在已有表上加约束

:::example{id="not-null-violation"}

:::example{id="unique-violation"}

:::example{id="unique-nulls-allowed"}

## 3. CHECK 与 DEFAULT — 行级断言与默认值

`CHECK (<expr>)` 声明一个返回 boolean 的表达式，PG 在每次 INSERT / UPDATE 时对受影响行求值；返回 FALSE 时拒绝写入并返回 SQLSTATE 23514。表达式可以引用本行的多列，但不能引用其他行或其他表。`DEFAULT <expr>` 给列设默认值：INSERT 语句没提该列时，PG 用 `<expr>` 求值结果填入；`<expr>` 可以是字面量、函数调用（`now()`、`gen_random_uuid()`）或常量表达式。

### 语法骨架

```text
CREATE TABLE <table> (
  <col>  <type> [NOT NULL] [DEFAULT <expr>] [CHECK (<predicate>)],
  ...,
  CONSTRAINT <name> CHECK (<predicate-over-multiple-cols>)
);
```

- `DEFAULT <expr>`：列默认值；插入时未指定该列则使用
- `CHECK (<predicate>)`：列级断言（只能引用本列）或表级断言（可引用多列）
- `CONSTRAINT <name>`：给约束命名，便于后续 `ALTER ... DROP CONSTRAINT <name>`
- 违反 CHECK 返回 23514（check_violation）

:::example{id="check-violation-negative-total"}

:::example{id="check-violation-zero-qty"}

:::example{id="default-status-pending"}

## 4. DEFERRABLE — 延迟约束

默认约束在**语句级**立刻检查：每条 INSERT / UPDATE 执行完就验证。`DEFERRABLE` 约束允许把检查推迟到**事务提交时**才进行，从而允许中间状态短暂违反约束。`INITIALLY DEFERRED` 默认就延迟到提交；`INITIALLY IMMEDIATE` 默认立刻检查，可在事务里用 `SET CONSTRAINTS <name> DEFERRED` 临时切换。常用于环形外键、PK / FK 交换两行引用值等需要中间状态合法的场景。

### 语法骨架

```text
ALTER TABLE <table>
  ADD CONSTRAINT <name> FOREIGN KEY (<col>)
  REFERENCES <other>(<col>)
  DEFERRABLE INITIALLY {IMMEDIATE | DEFERRED};

-- 事务内手动切换检查时机
SET CONSTRAINTS <name> {DEFERRED | IMMEDIATE};
SET CONSTRAINTS ALL DEFERRED;
```

- `DEFERRABLE`：声明约束可被延迟（默认 NOT DEFERRABLE）
- `INITIALLY DEFERRED` / `INITIALLY IMMEDIATE`：约束在事务开始时的默认状态
- `SET CONSTRAINTS`：仅对当前事务有效，必须先声明为 DEFERRABLE
- 仅 FK、UNIQUE、PK、EXCLUDE 约束支持 DEFERRABLE；CHECK / NOT NULL 不支持

:::example{id="deferrable-swap-keys"}
