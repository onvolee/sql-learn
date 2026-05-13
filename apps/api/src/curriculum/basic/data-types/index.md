# 数据类型

每一列在建表时都要声明类型，类型决定**存什么形状的值、占多少字节、能做哪些运算**。PG 内建一大批类型，本章只挑入门必会的几类讲清楚行为差异：数值、字符串、时间、布尔与 UUID，以及半结构化与集合类型的「形态长什么样」。深入操作（JSONB 操作符、数组高级函数、范围运算）留到后续章节。

本模块在 `m_data_types` schema 下预置了一张 `samples` 表，每列对应一种类型，共 5 行（含一行所有可空列都是 NULL）。每个示例点右下角"运行"会真正执行——drizzle pane 是同一语义的 drizzle-orm 写法。

## 表结构

```sql
CREATE TABLE samples (
  id          serial PRIMARY KEY,
  n_int       integer,
  n_big       bigint,
  n_num       numeric(10, 4),
  n_real      real,
  s_text      text,
  s_varchar   varchar(10),
  s_char      char(5),
  t_date      date,
  t_ts        timestamp,
  t_tstz      timestamptz,
  t_interval  interval,
  b_bool      boolean,
  u_uuid      uuid,
  j_jsonb     jsonb,
  a_arr       text[]
);
```

## 1. 数值类型

整数族：`integer` 32 位有符号（约 ±21 亿）、`bigint` 64 位有符号。小数族：`numeric(p, s)` 是任意精度的十进制定点数（`p` 总位数，`s` 小数位），运算精确；`real` 是 32 位 IEEE-754 浮点，运算快但有舍入误差。涉及金额、计数、比例等需要精确语义的列**用 numeric**，不用 real。

### 语法骨架

```text
integer            -- 4 字节，范围约 -2.1e9 ~ +2.1e9
bigint             -- 8 字节，范围约 -9.2e18 ~ +9.2e18
numeric(<p>, <s>)  -- 任意精度十进制，<p> 总位数 ≤ 1000，<s> 小数位
real               -- 4 字节浮点，6 位有效数字，可能有舍入误差
```

- `<p>`：`numeric` 总位数（精度），含小数点两侧
- `<s>`：`numeric` 小数位（标度），超出按四舍五入截断
- 浮点 `0.1 + 0.2` ≠ `0.3`；`numeric` 没这个问题
- `integer` 越界返回 SQLSTATE `22003`

:::example{id="numeric-precision"}

:::example{id="real-vs-numeric-money"}

:::example{id="integer-overflow"}

## 2. 字符串类型

`text` 不限长度。`varchar(n)` 限制最大长度 `n`，超长报错 SQLSTATE `22001`。`char(n)` 是定长字符串：实际值不足 `n` 时**用空格右补**到 `n` 个字符，几乎所有场景都不该用。在 PG 内部三者的存储与性能差异可以忽略；**默认用 text**，需要业务级长度约束时再用 `varchar(n)` 或加 `CHECK (length(col) <= n)`。

### 语法骨架

```text
text             -- 不限长度
varchar(<n>)     -- 最大 <n> 字符；超长抛 SQLSTATE 22001
char(<n>)        -- 定长 <n> 字符；不足部分以空格右补
```

- `<n>`：以**字符数**计（非字节），`length()` 返回字符数
- `varchar` 不写 `<n>` 退化为不限长（等价 text）
- `char(n)` 比较时尾部空格被忽略（`'ab   '::char(5) = 'ab'`）但 `length()` 仍是 5

:::example{id="char-pads-spaces"}

:::example{id="varchar-length-limit"}

:::example{id="text-no-limit"}

## 3. 时间类型

`date` 只存日期（年月日）。`timestamp` 存日期 + 时间但**不带时区信息**，字面量怎么写就怎么存。`timestamptz` 存日期 + 时间且**内部统一为 UTC**：写入时按当前会话时区把字面量解释为 UTC 时刻，读出时按当前会话时区把 UTC 转回本地表示——同一行的值在不同时区会议室里"显示"不同，但代表同一个绝对时刻。`interval` 是两个时间点之间的差，可与时间点相加减。业务时间列**默认用 timestamptz**。

### 语法骨架

```text
date          -- 只日期            '2026-01-01'
timestamp     -- 日期+时间，无时区  '2026-01-01 12:00:00'
timestamptz   -- 日期+时间，带时区  '2026-01-01 12:00:00+09'
interval      -- 时间差            interval '7 days'
                                   interval '90 minutes'
                                   interval '1 year 2 months'
```

- `timestamp` 字段比较时纯字符串语义；`timestamptz` 比较时间点
- `now()` / `current_timestamp` 返回 `timestamptz`；`current_date` 返回 `date`
- `interval` 字面量单位：`year` / `month` / `day` / `hour` / `minute` / `second`

:::example{id="now-vs-current-date"}

:::example{id="timestamp-tz-difference"}

:::example{id="interval-arithmetic"}

## 4. 布尔与 UUID

`boolean` 有三个值：`true` / `false` / `NULL`。`NULL` 代表"未知"——它和任何东西的比较（包括 `NULL = NULL`）结果都是 `NULL`，要判断是否为空必须用 `IS NULL` / `IS NOT NULL`。`AND` / `OR` 也遵循三值逻辑（`TRUE AND NULL` → `NULL`，`FALSE AND NULL` → `FALSE`）。

`uuid` 是 128 位的全局唯一标识符，文本形式形如 `11111111-1111-1111-1111-111111111111`。PG 13+ 内建 `gen_random_uuid()` 生成随机 v4 UUID，无需扩展。分布式系统里用 UUID 主键代替 serial，可以在客户端预生成 id 而不需要回查数据库。

### 语法骨架

```text
boolean          -- 字面量：TRUE / FALSE / NULL
                   也接受：true 't' 'yes' 'on' '1' / false 'f' 'no' 'off' '0'
uuid             -- 32 个十六进制字符，按 8-4-4-4-12 分组
gen_random_uuid() -- 内建函数，返回随机 v4 UUID
```

- 判 NULL 用 `IS NULL` / `IS NOT NULL`，**不要**用 `= NULL`
- UUID 列可显式插入字符串字面量（`'11111111-...'::uuid`），也可让 `gen_random_uuid()` 填充

:::example{id="bool-three-values"}

:::example{id="uuid-generate"}

## 5. 半结构化与集合

`jsonb` 是二进制存储的 JSON，列里能放对象、数组、字符串、数字、布尔、null 任意形态（操作符如 `->` `->>` `@>` 在 ch13 JSONB 章展开）。`text[]` / `int[]` 是数组类型，列里存一段同类元素的序列（高级函数 `unnest` / `ANY` 在 ch16 展开）。`int4range` / `tsrange` 等是范围类型，表达"从 X 到 Y"的连续区间，可查"是否包含某点 / 区间是否相交"（操作符在 ch16 展开）。HSTORE 是扁平 KV 扩展，结构能力比 jsonb 弱，新项目几乎不用。

### 语法骨架

```text
jsonb          -- '{"k": 1, "v": [1, 2]}'::jsonb
               -- '[1, 2, 3]'::jsonb
               -- '"any scalar"'::jsonb

<type>[]       -- ARRAY['a', 'b', 'c']
               -- ARRAY[1, 2, 3]
               -- '{a,b,c}'::text[]

int4range      -- int4range(1, 10)         -- 半开 [1, 10)
               -- int4range(1, 10, '[]')   -- 闭区间 [1, 10]
```

- `jsonb` vs `json`：`jsonb` 解析后存二进制，支持索引；`json` 存原文，几乎只在保留原始格式时用
- 数组下标**从 1 开始**：`(ARRAY['a','b','c'])[1] = 'a'`
- 范围三种括号形态：`[]` 闭、`()` 开、`[)` / `(]` 半开

:::example{id="jsonb-literal"}

:::example{id="array-literal"}

:::example{id="range-literal"}
