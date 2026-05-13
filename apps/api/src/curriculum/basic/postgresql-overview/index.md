# PostgreSQL 概述

PostgreSQL（简称 PG）是一个开源的**对象关系型数据库**，1996 年开源，至今仍由社区主导开发。它兼容 SQL 标准里的大多数特性，同时把"关系"这套模型扩展到对象、数组、JSON 等非标量数据上。与 **MySQL** 相比，PG 在事务、子查询、CTE、窗口函数、JSON、自定义类型上更完整严谨；与 **Oracle** 相比，PG 在企业级特性上有差距，但开源、无 license 成本。适用场景：业务系统的主库（OLTP）、混合负载（少量分析），不擅长纯 OLAP 大宽表扫描和超大规模水平扩展。

本模块在 `m_postgresql_overview` schema 下预置了一张 `items` 表，4 行覆盖了「有 tags / 有 data / 空数组 / NULL」四种形态，用来演示后面几个非标量列的小 demo。

## 1. PG 自报家门 — 看版本和服务端参数

PG 是开源对象关系型数据库，支持 **ACID** 事务（Atomicity / Consistency / Isolation / Durability）。并发控制走 **MVCC**——同一行可以存在多个历史版本，读不会阻塞写、写也不会阻塞读。本节先让 PG 自己说出版本号、字符编码、时区，建立第一手感觉。

### 语法骨架

```text
SELECT version();

SHOW <param>;
```

- `version()`：内置函数，返回 PostgreSQL 完整版本字符串
- `SHOW <param>`：查询某个服务端参数当前值，如 `server_encoding` / `TimeZone` / `search_path`
- `SHOW` 不接 `FROM`，直接返回单行单列

:::example{id="show-version"}

:::example{id="show-encoding"}

:::example{id="show-timezone"}

## 2. 事务原子性的体感 — SAVEPOINT 局部回滚

ACID 里的 **A** 是 **Atomicity**——一个事务要么整体提交、要么整体回滚，不会留下半截写入。**SAVEPOINT** 是事务内的一个标记，配合 `ROLLBACK TO SAVEPOINT` 可以**局部**撤销标记之后的改动，标记之前的改动仍然保留。本节用 SAVEPOINT 在单事务里观察"部分撤销"的效果。

### 语法骨架

```text
SAVEPOINT <name>;

ROLLBACK TO SAVEPOINT <name>;
```

- `<name>`：savepoint 标识符，同一事务内可有多个
- `SAVEPOINT` 定义一个回滚点，后续 `ROLLBACK TO` 把状态拨回该点
- `ROLLBACK TO` 不结束事务，事务仍在进行中
- 本课程 `/exec` 端点本身已在一个外层事务里跑，所以单独写 `BEGIN/COMMIT` 多余，直接用 SAVEPOINT 即可

:::example{id="tx-savepoint-demo"}

## 3. MVCC 一瞥 — 看每行的系统列

PG 用 **MVCC**（多版本并发控制）实现读写不互相阻塞：每行物理上带几个系统列，`xmin` = 创建该版本的事务 id，`xmax` = 删除/锁定该版本的事务 id（活跃版本为 0），`ctid` = 行的物理位置 `(block, offset)`。`UPDATE` 不会原地改行，而是把老版本的 `xmax` 写上、再插入一个新版本——这是 PG 能做"读不阻塞写"的根因。本节只「看到证据」，机制详情留到后面的事务/MVCC 章节。

### 语法骨架

```text
SELECT xmin, xmax, ctid, <user-columns>
FROM <table>;
```

- `xmin` / `xmax`：行版本的事务 id，类型 `xid`
- `ctid`：行的物理位置，类型 `tid`，格式 `(block, offset)`
- 这三个是隐藏系统列，`SELECT *` 不会带出来，必须显式写
- `<user-columns>`：用户自己定义的普通列

:::example{id="inspect-xmin"}

## 4. 对象关系 — 非标量列

PG 不只是「表 + 关系」——单元格本身可以是**数组**、**JSONB**、几何类型、自定义复合类型等。这是名字里"对象关系"那一半的来源：列的类型系统是可扩展的，不限于 `integer` / `text` 这种原子值。本节预览数组列和 JSONB 列，详细操作符和函数留到后面的类型专题章节。

### 语法骨架

```text
CREATE TABLE <table> (
  <col>  <type>,
  <col>  <element-type>[],   -- 数组列
  <col>  jsonb,              -- 半结构化列
  ...
);
```

- `<element-type>[]`：任意类型加 `[]` 即变成该类型的数组列（如 `text[]` / `integer[]`）
- `jsonb`：二进制 JSON，写入时解析为内部树形结构，查询效率高于 `json`
- 这些列里的值仍可以 `NULL`；数组也可以是空数组 `'{}'`，二者不同

:::example{id="array-column"}

:::example{id="jsonb-column"}
