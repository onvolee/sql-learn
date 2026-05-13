# 高级数据类型

本章在已会的基础标量（→ ch05）和约束（→ ch07）之上，引入 PG 五类常用「非标量」类型：数组、范围、GENERATED 列、DOMAIN、ENUM。它们的共性是把更多语义压回类型系统里——少几行业务校验、少几张关联表。

本模块在 `m_advanced_types` schema 下预置：

- `users`（6 行）：含 `tags text[]` 数组列、`age_group` GENERATED STORED 列。
- `bookings`（5 行）：含 `during tstzrange` 范围列，`room='B'` 两段故意重叠用于范围 example。
- 已建好的 `email_t`（DOMAIN）和 `color_t`（ENUM）类型，相关 example 自己 DROP / CREATE 局部对象。

## 1. 数组类型

任何标量类型加 `[]` 就是数组类型，如 `text[]` / `int[]`。字面量两种写法：`'{a,b,c}'` 或 `ARRAY['a','b','c']`。数组下标从 1 开始；支持多维但教学场景一般只用一维。常用操作符 `@>`（左包含右）、`<@`（左被包含）、`&&`（重叠），可配合 GIN 索引加速。

### 语法骨架

```text
-- 列声明
<column>  <type>[]  [NOT NULL] [DEFAULT '{}']

-- 字面量
'{a,b,c}'              -- 文本形态
ARRAY['a','b','c']     -- 构造器形态

-- 操作符
<arr> @> <arr>          -- 左包含右
<arr> <@ <arr>          -- 左被包含
<arr> && <arr>          -- 有交集

-- 展开为行
unnest(<arr>)
```

- `<type>`：任意标量类型，`text` / `integer` / `numeric` / `date` / ...
- `'{a,b,c}'`：字符串内不能再含 `{}` 字符，复杂值用 `ARRAY[...]`
- `unnest`：把 N 元素数组展平成 N 行，常配合 `FROM users, unnest(tags)` 用

:::example{id="array-insert"}

:::example{id="array-operators"}

:::example{id="array-unnest"}

:::example{id="array-agg"}

## 2. 范围类型

范围类型表达「一段连续区间」，内建 `int4range` / `numrange` / `tsrange` / `tstzrange` / `daterange`。字面量 `'[lower, upper)'` 用方括号表示「闭」、圆括号表示「开」——典型时间区间用 `[)` 含起点不含终点。常用操作符 `@>`（包含某点）、`&&`（两区间重叠）。配合 EXCLUDE 约束 + GiST 索引可以在 DB 层拒绝重叠预订。

### 语法骨架

```text
-- 列声明
<column>  tstzrange  NOT NULL

-- 字面量 / 构造器
'[2026-05-12 09:00, 2026-05-12 10:00)'::tstzrange
tstzrange('2026-05-12 09:00+00', '2026-05-12 10:00+00', '[)')

-- 操作符
<range> @> <point>       -- 区间包含点
<range> @> <range>       -- 区间包含区间
<range> && <range>       -- 两区间有重叠

-- EXCLUDE 约束（防重叠）
ALTER TABLE <table>
  ADD CONSTRAINT <name>
  EXCLUDE USING gist (<scalar-col> WITH =, <range-col> WITH &&);
```

- 边界符 `[` `(` `]` `)`：方括号闭、圆括号开，时间区间惯例 `[)`
- `tstzrange('lower','upper','[)')`：构造器形态，第三参数显式指定边界类型
- EXCLUDE 必须 GiST 索引，所以 `range-col` 用 `&&`、等值字段用 `=`

:::example{id="range-overlap"}

:::example{id="range-contains-point"}

:::example{id="exclude-no-overlap"}

## 3. GENERATED 列

`GENERATED ALWAYS AS (<expr>) STORED` 让某列由表达式自动算出，写入时由 PG 计算并物理存储，读出时与普通列无差别。PG 目前只支持 `STORED`，没有 `VIRTUAL`。不能对 GENERATED 列手动写值（包括 INSERT 和 UPDATE），尝试写会报 `428C9`。适合用来反规范化派生字段，避免业务层每次重算。

### 语法骨架

```text
CREATE TABLE <table> (
  ...
  <col>  <type>  GENERATED ALWAYS AS (<expr>) STORED
);
```

- `<expr>`：只能引用同一行的其他列，且必须是 IMMUTABLE 表达式
- `STORED`：必填关键字，写入时计算并落盘
- 不能给 GENERATED 列指定 `DEFAULT`、也不能在 INSERT/UPDATE 列表里出现

:::example{id="generated-column-read"}

:::example{id="generated-column-write-fails"}

## 4. DOMAIN — 带约束的类型别名

DOMAIN 在已有类型上套一层「带约束的别名」。`CREATE DOMAIN email_t AS text CHECK (...)` 定义后，在多张表里都能直接当类型用，约束跟着类型走，不用在每张表重复写 CHECK。写入时 PG 自动校验，违反约束报 `23514`。

### 语法骨架

```text
CREATE DOMAIN <name> AS <base-type>
  [DEFAULT <expr>]
  [CONSTRAINT <cname>] CHECK (<predicate>);

DROP DOMAIN [IF EXISTS] <name>;
```

- `<base-type>`：任意已有类型，如 `text` / `integer` / `numeric(10,2)`
- `CHECK (...)`：用 `VALUE` 关键字引用被检查的值
- 一个 DOMAIN 可挂多个 CHECK，按定义顺序依次校验

:::example{id="domain-define-and-use"}

## 5. ENUM — 枚举类型

`CREATE TYPE <name> AS ENUM (...)` 定义一组有序的字面量。相比 `text + CHECK (col IN (...))`，ENUM 占用更紧凑（内部存 oid）、有显式排序、改字符集时不会跟着乱。新增值用 `ALTER TYPE ADD VALUE IF NOT EXISTS '<v>'`；改名 / 删值 PG 不直接支持，得重建类型。

### 语法骨架

```text
CREATE TYPE <name> AS ENUM ('<v1>', '<v2>', ...);

ALTER TYPE <name> ADD VALUE [IF NOT EXISTS] '<v>' [BEFORE | AFTER '<other>'];

DROP TYPE [IF EXISTS] <name>;

-- 查所有取值
SELECT enum_range(NULL::<name>);
```

- 字面量顺序就是排序顺序，`'red' < 'green' < 'blue'` 按定义顺序比较
- `ALTER TYPE ADD VALUE` 在事务里不能与同 ENUM 的使用语句混跑（PG 限制）
- 想删某个取值，得新建一个 type、迁移数据、再 swap

:::example{id="enum-define-and-use"}

:::example{id="enum-add-value"}
