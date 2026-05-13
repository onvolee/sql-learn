import { sql } from 'drizzle-orm';
import type { ExampleDef } from '../../../types.ts';

const example: ExampleDef = {
  id: 'tx-savepoint-demo',
  title: 'SAVEPOINT 局部回滚',
  support: 'partial',
  display: {
    sql: `-- 先清掉历次运行残留，保证每次从空状态开始
DELETE FROM items WHERE name LIKE 'sp-demo-%';

-- 第一行：savepoint 之前
INSERT INTO items (name) VALUES ('sp-demo-keep');

SAVEPOINT before_second;

-- 第二行：savepoint 之后，下面会被回滚
INSERT INTO items (name) VALUES ('sp-demo-drop');

ROLLBACK TO SAVEPOINT before_second;

-- 最终只看到 'sp-demo-keep'
SELECT id, name FROM items
WHERE name LIKE 'sp-demo-%'
ORDER BY id;`,
    drizzle: `import { sql } from 'drizzle-orm';

await db.execute(sql\`
  DELETE FROM items WHERE name LIKE 'sp-demo-%';
  INSERT INTO items (name) VALUES ('sp-demo-keep');
  SAVEPOINT before_second;
  INSERT INTO items (name) VALUES ('sp-demo-drop');
  ROLLBACK TO SAVEPOINT before_second;
  SELECT id, name FROM items
  WHERE name LIKE 'sp-demo-%'
  ORDER BY id
\`);`,
  },
  execute: (db) =>
    db.execute(sql`
      DELETE FROM items WHERE name LIKE 'sp-demo-%';
      INSERT INTO items (name) VALUES ('sp-demo-keep');
      SAVEPOINT before_second;
      INSERT INTO items (name) VALUES ('sp-demo-drop');
      ROLLBACK TO SAVEPOINT before_second;
      SELECT id, name FROM items
      WHERE name LIKE 'sp-demo-%'
      ORDER BY id
    `),
};

export default example;
