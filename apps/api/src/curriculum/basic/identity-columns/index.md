# 自增与标识列

主键值要唯一，手工分配既麻烦又容易冲突。PostgreSQL 提供三种自增 / 标识列写法：经典的 `SERIAL`、SQL 标准的 `GENERATED ... AS IDENTITY`、以及不依赖中心计数的 `uuid`。前两种底层都基于一个独立对象——**SEQUENCE**，本章最后一节单独看它。

本模块在 `m_identity_columns` schema 下预置了三张表：`t_serial`、`t_identity`、`t_uuid`，各 3 行，分别演示一种 ID 策略。

## 1. SERIAL — 经典自增

`SERIAL` 是一个**语法糖**：写 `id serial PRIMARY KEY`，PG 实际帮你做三件事——把列类型设成 `integer`、新建一个隐式 `SEQUENCE`、把列的默认值设为 `nextval(<那个序列>)`。所以列的真实类型还是 `integer`，自增能力来自默认值。`SERIAL` 兼容历史代码，新代码推荐下一节的 `IDENTITY`。

### 语法骨架

```text
CREATE TABLE <table> (
  <col>  serial PRIMARY KEY,
  ...
);

-- 等价于：
CREATE SEQUENCE <table>_<col>_seq;
CREATE TABLE <table> (
  <col>  integer PRIMARY KEY DEFAULT nextval('<table>_<col>_seq'),
  ...
);
ALTER SEQUENCE <table>_<col>_seq OWNED BY <table>.<col>;
```

- `serial`：4 字节自增，对应 `integer`；大表用 `bigserial`（对应 `bigint`）
- 隐式序列名固定为 `<table>_<col>_seq`，挂在同一个 schema 下
- 不显式给 `id` 时走 `nextval`；显式给 `id` 则不动用序列（可能导致后续 `nextval` 撞主键）

:::example{id="serial-insert-default"}

:::example{id="serial-currval"}

## 2. GENERATED AS IDENTITY — 标准化写法

`GENERATED ... AS IDENTITY` 是 SQL 标准的自增写法，PG 10+ 支持。和 `SERIAL` 比，权限管理更干净（序列依附于列）、迁移更友好、行为更明确。两种模式：`BY DEFAULT` 允许 INSERT 时手动覆盖 `id`，`ALWAYS` 则禁止——除非加 `OVERRIDING SYSTEM VALUE`。

### 语法骨架

```text
CREATE TABLE <table> (
  <col>  integer GENERATED { BY DEFAULT | ALWAYS } AS IDENTITY PRIMARY KEY,
  ...
);

-- BY DEFAULT：可手动给值
INSERT INTO <table> (<col>, ...) VALUES (<explicit>, ...);

-- ALWAYS：手动给值需显式覆盖
INSERT INTO <table> (<col>, ...)
OVERRIDING SYSTEM VALUE VALUES (<explicit>, ...);
```

- `BY DEFAULT`：不给就用 IDENTITY 序列，给了就用你给的值（推荐）
- `ALWAYS`：始终用 IDENTITY 序列；强行赋值会报 `428C9`（generated_always）
- 底层仍然是一个 SEQUENCE，但归 PG 内部管，不暴露名字（查 `pg_get_serial_sequence` 一样能拿到）

:::example{id="identity-default-insert"}

:::example{id="identity-explicit-override"}

:::example{id="identity-always-rejects"}

## 3. UUID 主键

`uuid` 是 128 位的全局标识，写成 `xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx` 形式。PG 13+ 内建 `gen_random_uuid()` 函数生成随机 v4 UUID，**不需要扩展**。优点是分布式生成不必中心化（多台机器互不冲突）；缺点是体积比 `bigint` 大一倍、随机分布导致按主键插入的局部性差。

### 语法骨架

```text
CREATE TABLE <table> (
  <col>  uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  ...
);

-- 不给 id：默认值生成
INSERT INTO <table> (<other-cols>) VALUES (...);

-- 显式给 id：写 UUID 字面量
INSERT INTO <table> (<col>, <other-cols>)
VALUES ('xxxxxxxx-...-...-...-xxxxxxxxxxxx'::uuid, ...);
```

- `uuid` 数据类型本身就内置，不要混淆「类型」和「生成函数」
- `gen_random_uuid()` 返回随机 v4；要时间有序 UUID 需额外扩展（本章不展开）
- 字面量带 `::uuid` 类型转换可避免歧义

:::example{id="uuid-default-insert"}

:::example{id="uuid-explicit"}

## 4. SEQUENCE — 底层对象

`SEQUENCE` 是 PG 里**独立的数据库对象**，专门用来产生递增整数。`SERIAL` 和 `IDENTITY` 列只是「关联一个 SEQUENCE + 默认调用 nextval」的封装——底层都是它。三个核心函数：`nextval()` 推进并返回下一个值、`currval()` 返回当前会话上一次 `nextval` 的结果、`setval()` 强制把序列设到某个值。

### 语法骨架

```text
CREATE SEQUENCE [IF NOT EXISTS] <name>
  [START <n>]
  [INCREMENT <n>]
  [MINVALUE <n>] [MAXVALUE <n>];

SELECT nextval('<name>');   -- 取下一个值（推进）
SELECT currval('<name>');   -- 取本会话最近一次 nextval 的值
SELECT setval('<name>', <n>);  -- 把当前值改成 n
```

- `<name>`：序列名，schema 内唯一
- `START`：起始值，默认 1
- `INCREMENT`：步长，默认 1（可负数）
- `currval` 必须先在同会话里调过 `nextval`，否则报错

:::example{id="seq-create-use"}

:::example{id="seq-currval"}

:::example{id="seq-inspect"}
