import { sql } from 'drizzle-orm';
import type { ExampleDef } from '../../../types.ts';

const example: ExampleDef = {
  id: 'chinese-without-zhparser',
  title: '不装 zhparser，中文 tsvector 长什么样',
  support: 'partial',
  display: {
    sql: `SELECT
  to_tsvector('simple',  '我爱 PostgreSQL 数据库')   AS simple_cfg,
  to_tsvector('english', '我爱 PostgreSQL 数据库')   AS english_cfg;`,
    drizzle: `import { sql } from 'drizzle-orm';

await db.execute(sql\`
  SELECT
    to_tsvector('simple',  '我爱 PostgreSQL 数据库')   AS simple_cfg,
    to_tsvector('english', '我爱 PostgreSQL 数据库')   AS english_cfg
\`);`,
  },
  execute: (db) =>
    db.execute(sql`
      SELECT
        to_tsvector('simple',  '我爱 PostgreSQL 数据库')   AS simple_cfg,
        to_tsvector('english', '我爱 PostgreSQL 数据库')   AS english_cfg
    `),
};

export default example;
