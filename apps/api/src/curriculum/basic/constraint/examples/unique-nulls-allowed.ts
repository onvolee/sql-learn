import { sql } from 'drizzle-orm';
import type { ExampleDef } from '../../../types.ts';

const SENTINEL = Symbol('nulls-rollback');

const example: ExampleDef = {
  id: 'unique-nulls-allowed',
  title: 'UNIQUE 列允许多个 NULL（默认 NULLS DISTINCT）',
  support: 'partial',
  display: {
    sql: `-- 临时建表演示：UNIQUE 列默认允许多个 NULL，
-- 因为 PG 把 NULL 视为「未知」彼此不相等。
-- 用 SAVEPOINT 包住，结束回滚不污染状态。
SAVEPOINT demo;

CREATE TEMP TABLE t_demo (
  v text UNIQUE
);

INSERT INTO t_demo (v) VALUES (NULL), (NULL), ('x');

SELECT v, count(*) OVER () AS total
FROM t_demo;

ROLLBACK TO SAVEPOINT demo;`,
    drizzle: `import { sql } from 'drizzle-orm';

await db.execute(sql\`
  CREATE TEMP TABLE t_demo (v text UNIQUE)
\`);
await db.execute(sql\`
  INSERT INTO t_demo (v) VALUES (NULL), (NULL), ('x')
\`);
const rows = await db.execute(sql\`
  SELECT v, count(*) OVER () AS total FROM t_demo
\`);`,
  },
  execute: async (db) => {
    // 整段包在 SAVEPOINT 内，结束回滚以保证可重复运行（TEMP TABLE 也回滚）。
    try {
      await db.transaction(async (sp) => {
        await sp.execute(sql`CREATE TEMP TABLE t_demo (v text UNIQUE)`);
        await sp.execute(sql`INSERT INTO t_demo (v) VALUES (NULL), (NULL), ('x')`);
        const result = await sp.execute(
          sql`SELECT v, (count(*) OVER ())::int AS total FROM t_demo ORDER BY v NULLS LAST`,
        );
        const rows = (result as { rows?: unknown[] }).rows ?? [];
        throw { [SENTINEL]: true, rows };
      });
    } catch (e) {
      if (e && typeof e === 'object' && (e as Record<symbol, unknown>)[SENTINEL]) {
        const payload = e as { rows: unknown[] };
        return { rows: payload.rows };
      }
      throw e;
    }
    return { rows: [] };
  },
};

export default example;
