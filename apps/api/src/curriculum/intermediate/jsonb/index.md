# JSON 与 JSONB

PG 用两种类型存 JSON：`json` 保留原始文本，`jsonb` 解析后以二进制存储并支持索引。实战里几乎只用 `jsonb`——可查、可改、可索引；本章过一遍它的存储模型、四类操作符、三个常用函数，以及 GIN 索引的两种 opclass。

本模块在 `m_jsonb` schema 下预置了一张 `docs` 表（8 行），`body` 列是 jsonb，里面含嵌套对象 `author`、数组 `tags`、数字对象 `stats`、布尔 `published`。

## 1. json vs jsonb — 存储模型差异

`json` 把原文照搬存进去，每次读取都重新解析，键的顺序和重复都保留；`jsonb` 解析后按二进制结构存，键自动去重（保留最后一次出现的值）、内部按键排序，因此查找和操作都快得多。代价是写入要解析一次、字节稍大。生产场景几乎都用 `jsonb`，`json` 只在「必须保留原始文本」时才用（审计日志、签名验证）。

### 语法骨架

```text
<col>  json                 -- 原始文本，保留键顺序与重复键
<col>  jsonb                -- 二进制，键去重、可索引、操作符更全
```

- 两者都接受同一种 JSON 字面量字符串（`'{"a":1}'`）
- 选型 = 是否需要索引和高频读取——绝大多数选 `jsonb`

:::example{id="inspect-storage-difference"}

## 2. 操作符 — 取值、路径、包含、键存在

`jsonb` 的操作符按返回类型与用途分四组：取键 / 取路径 / 包含 / 键存在。取键有「保 jsonb 还是转 text」之分（`->` vs `->>`），路径版同理（`#>` vs `#>>`）；包含 `@>` 判断左值是否「包住」右值，键存在 `?`/`?|`/`?&` 判断顶层键是否出现。

### 语法骨架

```text
<jsonb> -> '<key>'           → jsonb         取键，得到 jsonb（保留嵌套结构）
<jsonb> ->> '<key>'          → text          取键，得到 text（不能再链式 ->）
<jsonb> #>  '{<k>,<k>,...}'  → jsonb         按路径取，得 jsonb
<jsonb> #>> '{<k>,<k>,...}'  → text          按路径取，得 text

<jsonb> @>  <jsonb>          → boolean       左是否包含右（结构匹配）
<jsonb> ?   '<key>'          → boolean       顶层是否有此键
<jsonb> ?|  ARRAY['<k>',...] → boolean       顶层是否有其中任一键
<jsonb> ?&  ARRAY['<k>',...] → boolean       顶层是否全有这些键
```

- `->` 链式时只能跟 `->`：`body -> 'author' -> 'name'`；末步用 `->>` 转 text 才能与字符串比较
- `#>` 路径里数字（如 `'{tags,0}'`）表示数组下标，从 0 开始
- `@>` 是 GIN 索引最常加速的查询形态（见第 4 节）
- `?` 只看顶层键；想判嵌套键存在用 `#>` 取出来再判 `IS NOT NULL`

:::example{id="arrow-vs-double-arrow"}

:::example{id="path-operator"}

:::example{id="contains-operator"}

:::example{id="key-exists"}

## 3. 函数 — jsonb_set / jsonb_path_query / jsonb_array_elements

操作符负责读，函数负责改和拆。`jsonb_set` 按路径写入或新增键，`jsonb_path_query` 用 JSONPath 表达式抽值，`jsonb_array_elements_text` 把数组拆成多行（典型场景：tags 数组与外部表 JOIN）。

### 语法骨架

```text
jsonb_set(<target> jsonb, <path> text[], <new_value> jsonb [, <create_missing> boolean])
                                                                    → jsonb
jsonb_path_query(<target> jsonb, <jsonpath>)             → SETOF jsonb
jsonb_array_elements(<array> jsonb)                      → SETOF jsonb
jsonb_array_elements_text(<array> jsonb)                 → SETOF text
```

- `<path>` 是 text 数组：`'{stats,views}'` 表示 stats 对象下的 views 键
- `<new_value>` 必须是 jsonb；插入数字用 `'100'::jsonb`，字符串用 `'"hello"'::jsonb`
- `<create_missing>` 默认 true：路径不存在则新增；false 则只覆盖已有键
- JSONPath：`$` 根、`.<key>` 取键、`[*]` 展开数组、`?(<filter>)` 过滤
- `jsonb_array_elements` / `_text` 在 `FROM` 里当行源用，配合主表 `,` 或 `LATERAL` 展开

:::example{id="jsonb-set-update"}

:::example{id="jsonb-path-query"}

:::example{id="jsonb-array-elements-unnest"}

## 4. GIN 索引 — 加速 @> 与键查询

`jsonb` 列加 GIN 索引后，`@>`、`?`、`?|`、`?&` 这类查询能走 Bitmap Index Scan 而不是顺扫。默认 opclass `jsonb_ops` 把每个键和每个值都建条目，支持上述全部操作符；`jsonb_path_ops` 只索引「键路径 + 值」的哈希，索引体积更小、`@>` 更快，但**只支持 `@>`**，键存在类操作符不走索引。

### 语法骨架

```text
CREATE INDEX [IF NOT EXISTS] <idx-name>
ON <table> USING gin (<jsonb-col>);                  -- 默认 jsonb_ops

CREATE INDEX [IF NOT EXISTS] <idx-name>
ON <table> USING gin (<jsonb-col> jsonb_path_ops);   -- 只支持 @>
```

- `jsonb_ops`：全功能、索引大；选它的场景 = 既要 `@>` 也要 `?`/`?|`/`?&`
- `jsonb_path_ops`：只索引值路径、更小更快；选它的场景 = 业务只用 `@>`
- 教学数据量小时 planner 仍可能选 Seq Scan；EXPLAIN 看到 `Bitmap Index Scan` 即证明索引可用

:::example{id="gin-default-opclass"}

:::example{id="gin-path-ops-opclass"}
