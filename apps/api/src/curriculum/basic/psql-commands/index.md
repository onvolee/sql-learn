# psql 命令

`psql` 是 PostgreSQL 官方提供的命令行客户端，`\` 开头的是它的**元命令**——大多数元命令本质上是 `pg_catalog` 或 `information_schema` 的快捷查询。本课程在 web 里跑 SQL，**无法真正执行元命令**，所以本章每个元命令都给出**等价的 SQL**，让你既能记住元命令，也能在没有 psql 的环境（图形客户端 / 应用代码里）查到同样的信息。

本模块在 `m_psql_commands` schema 下预置了一张 `books` 表（3 行）和一个示例函数 `title_upper(books)`，专门用来给 `\dt` / `\df` 的等价查询提供可见的返回。

## 1. 元命令的本质

psql 的元命令是**客户端**层面的快捷方式，不是 SQL 语句；服务端看到的永远是元命令被翻译之后发过来的查询。最直观的一条是 `\conninfo`：它打印的「当前连了哪个库、用哪个身份」全都来自一组标准 SQL 函数。学会把元命令读成「一段 SQL」，你就能在任何客户端环境拿到同样的信息。

### 语法骨架

```text
psql 元命令              等价 SQL
─────────────────────    ──────────────────────────────────────────────
\conninfo                SELECT current_database(),
                                current_user,
                                inet_server_addr(),
                                inet_server_port();
```

- `\conninfo`：psql 客户端命令，需要装了 psql 才能用
- `current_database()` / `current_user`：当前连接的数据库名与角色名
- `inet_server_addr()` / `inet_server_port()`：服务器监听的 IP 和端口；通过 Unix socket 连接时 `inet_server_addr()` 返回 NULL

:::example{id="equiv-of-conninfo"}

## 2. 列对象 — 数据库、表、列、索引

「列出某类对象」是用得最多的一组元命令：`\l` 列数据库、`\dt` 列表、`\d <table>` 看一张表的列、`\di` 列索引。它们背后分别对应 `pg_database` / `pg_tables` / `information_schema.columns` / `pg_indexes` 这几个系统视图。本节把这四条元命令逐个翻译成 SQL。

### 语法骨架

```text
psql 元命令              等价 SQL
─────────────────────    ──────────────────────────────────────────────
\l                       SELECT datname FROM pg_database;

\dt                      SELECT tablename FROM pg_tables
                         WHERE schemaname = current_schema();

\d <table>               SELECT column_name, data_type, is_nullable
                         FROM information_schema.columns
                         WHERE table_schema = current_schema()
                           AND table_name   = '<table>';

\di                      SELECT indexname, indexdef FROM pg_indexes
                         WHERE schemaname = current_schema();
```

- `\l`：列出**整个集群**的所有数据库，不限当前 schema
- `\dt` / `\di`：只列**当前 schema** 下的表 / 索引；想看别的 schema 加参数 `\dt other_schema.*`
- `\d <table>`：相当于「看表头」，输出列名、类型、可空性，以及末尾的索引和约束（pg_catalog 视图组合而成）
- `current_schema()`：返回 `search_path` 顺序中第一个真实存在的 schema

:::example{id="equiv-of-l"}

:::example{id="equiv-of-dt"}

:::example{id="equiv-of-d-table"}

:::example{id="equiv-of-di"}

## 3. 列函数与角色

`\df` 列函数（包括内置函数和用户定义的函数），`\du` 列角色——角色既包括登录用户也包括用户组，权限的完整模型在 ch15 展开，本节只看「怎么列出来」。两者分别对应 `pg_proc` 和 `pg_roles` 两个系统目录表。

### 语法骨架

```text
psql 元命令              等价 SQL
─────────────────────    ──────────────────────────────────────────────
\df                      SELECT proname,
                                pg_get_function_result(oid),
                                pg_get_function_arguments(oid)
                         FROM pg_proc
                         WHERE pronamespace = current_schema()::regnamespace;

\du                      SELECT rolname, rolsuper, rolcreatedb, rolcanlogin
                         FROM pg_roles;
```

- `pg_proc`：所有函数和过程都登记在这张表里
- `pg_get_function_result(oid)` / `pg_get_function_arguments(oid)`：把函数返回类型和参数列表还原成可读字符串
- `current_schema()::regnamespace`：把 schema 名转成 OID，跟 `pronamespace` 比较
- `pg_roles`：所有角色（用户/组）；`rolcanlogin = true` 才是真正能登录的「用户」

:::example{id="equiv-of-df"}

:::example{id="equiv-of-du"}

## 附：客户端元命令快速参考

下面这些是纯**输出控制 / 客户端行为**类的元命令，没有对应的 SQL——只在 psql 终端里有意义。背一眼即可，不做 Example。

| 元命令 | 用途 |
|---|---|
| `\timing` | 切换是否打印每条语句的执行耗时 |
| `\x` | 切换扩展显示（每行一列竖排），宽表查询时易读 |
| `\e` | 在 `$EDITOR` 里打开缓冲区，编辑完保存即执行 |
| `\i <file>` | 把一个 `.sql` 文件当成输入逐句执行 |
| `\?` | 列出所有元命令及简短说明（psql 自己的「帮助」） |
