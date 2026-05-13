import { eq } from 'drizzle-orm';
import type { ExampleDef } from '../../../types.ts';
import { employees } from '../schema.ts';

const example: ExampleDef = {
  id: 'dml-delete-min',
  title: 'DELETE — 先建后删（自洽）',
  support: 'full',
  display: {
    sql: `-- 先插一行临时数据（如已存在则跳过）
INSERT INTO employees (id, name, dept, salary)
VALUES (999, 'temp', 'sales', 1.00)
ON CONFLICT (id) DO NOTHING;

-- 再删掉它
DELETE FROM employees
WHERE id = 999
RETURNING id, name, dept;`,
    drizzle: `import { eq } from 'drizzle-orm';
import { employees } from './schema';

await db
  .insert(employees)
  .values({ id: 999, name: 'temp', dept: 'sales', salary: '1.00' })
  .onConflictDoNothing();

await db
  .delete(employees)
  .where(eq(employees.id, 999))
  .returning({ id: employees.id, name: employees.name, dept: employees.dept });`,
  },
  execute: async (db) => {
    await db
      .insert(employees)
      .values({ id: 999, name: 'temp', dept: 'sales', salary: '1.00' })
      .onConflictDoNothing();
    return db
      .delete(employees)
      .where(eq(employees.id, 999))
      .returning({ id: employees.id, name: employees.name, dept: employees.dept });
  },
};

export default example;
