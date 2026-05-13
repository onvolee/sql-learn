# PostgreSQL 学习大纲

## 一、入门阶段

### 1. 关系型数据库基础概念
- 表、行、列
- 主键、外键
- 索引
- Schema（命名空间）

### 2. PostgreSQL 概述
- 开源、ACID、MVCC、对象关系型
- 与 MySQL/Oracle 的核心差异
- 适用场景

### 3. psql命令
- psql 命令行
- psql 元命令（\l \c \dt \d \df \du \timing \x \e \i）

### 4. SQL 基础语法
- DDL：CREATE / ALTER / DROP
- DML：INSERT / UPDATE / DELETE
- DQL：SELECT / WHERE / ORDER BY / GROUP BY / HAVING / LIMIT
- DCL：GRANT / REVOKE

### 5. 数据类型
- 数值：INTEGER、BIGINT、NUMERIC、REAL
- 字符：TEXT、VARCHAR、CHAR
- 时间：DATE、TIMESTAMP、TIMESTAMPTZ、INTERVAL
- 布尔：BOOLEAN
- 标识：UUID
- 半结构化：JSON、JSONB
- 集合：ARRAY、HSTORE、RANGE

### 6. 自增与标识列
- SERIAL
- GENERATED AS IDENTITY
- UUID 主键
- SEQUENCE

### 7. 约束
- PRIMARY KEY、FOREIGN KEY
- UNIQUE、NOT NULL
- CHECK、DEFAULT
- 延迟约束（DEFERRABLE）

### 8. Schema 与命名空间
- CREATE SCHEMA
- search_path
- 跨 schema 引用

---

## 二、中级阶段

### 1. 高级查询
- JOIN：INNER / LEFT / RIGHT / FULL / CROSS / LATERAL
- 子查询与相关子查询
- EXISTS、IN、ANY、ALL
- 集合运算：UNION、INTERSECT、EXCEPT
- CTE（WITH）与递归 CTE
- 窗口函数：ROW_NUMBER、RANK、DENSE_RANK、LAG、LEAD、SUM/AVG OVER

### 2. 索引
- B-tree
- Hash
- GIN（JSONB、数组、全文）
- GiST（地理、范围）
- BRIN（超大有序表）
- 部分索引
- 表达式索引
- 覆盖索引（INCLUDE）
- 唯一索引

### 3. 事务与并发
- ACID
- 事务控制：BEGIN / COMMIT / ROLLBACK / SAVEPOINT
- 隔离级别：Read Committed、Repeatable Read、Serializable
- MVCC 原理
- 行锁、表锁、咨询锁
- 死锁检测与处理

### 4. 视图与函数
- 普通视图
- 物化视图与刷新
- 存储过程与函数（PL/pgSQL）
- 触发器（BEFORE / AFTER / INSTEAD OF）
- 事件触发器

### 5. JSON / JSONB
- 操作符：-> ->> #> @> ?
- JSONB 函数：jsonb_set、jsonb_build_object、jsonb_path_query
- JSONB 索引（GIN）

### 6. 全文搜索
- tsvector / tsquery
- to_tsvector / to_tsquery
- 中文分词扩展

### 7. 权限与安全
- 角色（ROLE）与用户
- 权限继承
- 对象级权限
- 行级安全（RLS）

### 8. 进阶类型
- 数组操作
- 范围类型（RANGE）
- 生成列（GENERATED）
- 自定义类型与 DOMAIN
- 枚举（ENUM）

---

## 三、高级阶段

### 1. 性能优化
- EXPLAIN / EXPLAIN ANALYZE
- 执行计划节点：Seq Scan、Index Scan、Bitmap Scan、Nested Loop、Hash Join、Merge Join
- 统计信息与 ANALYZE
- 查询重写技巧
- 索引设计与诊断

### 2. VACUUM 与维护
- 死元组与表膨胀
- VACUUM / VACUUM FULL
- AUTOVACUUM 调优
- 事务回卷与 freeze
- REINDEX

### 3. 监控与诊断
- pg_stat_activity
- pg_locks
- pg_stat_user_tables / indexes
- pg_stat_database
- pg_stat_statements
- 日志配置与慢查询日志

### 4. 架构原理
- 进程模型：Postmaster、Backend、Background Workers
- 内存结构：shared_buffers、work_mem、effective_cache_size、maintenance_work_mem
- 存储结构：Page、Tuple、TOAST
- 系统列：xmin、xmax、ctid
- WAL（预写日志）与 checkpoint

### 5. 配置调优
- postgresql.conf 关键参数
- 连接数与连接池（PgBouncer、Pgpool-II）
- 内存与 IO 参数
- 规划器参数（random_page_cost 等）

### 6. 高可用与复制
- 流复制（同步 / 异步）
- 逻辑复制（发布 / 订阅）
- 逻辑解码与 CDC
- 故障转移：Patroni、repmgr

### 7. 分区与分片
- 声明式分区：RANGE、LIST、HASH
- 分区裁剪
- 分区维护
- 水平分片（Citus）

### 8. 备份与恢复
- 逻辑备份：pg_dump、pg_dumpall
- 物理备份：pg_basebackup
- WAL 归档
- PITR（时间点恢复）

### 9. 扩展生态
- pg_stat_statements
- pgvector（向量检索）
- PostGIS（地理）
- TimescaleDB（时序）
- pg_trgm（模糊搜索）
- pg_cron（定时任务）
- pgcrypto / uuid-ossp
- hypopg（假设索引）
