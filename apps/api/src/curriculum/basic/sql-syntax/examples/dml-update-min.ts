import { eq, sql } from 'drizzle-orm';
import type { ExampleDef } from '../../../types.ts';
import { employees } from '../schema.ts';

const example: ExampleDef = {
  id: 'dml-update-min',
  title: 'UPDATE — 用表达式赋值',
  support: 'full',
  display: {
    sql: `UPDATE employees
SET salary = salary + 1
WHERE id = 1
RETURNING id, name, salary;`,
    drizzle: `import { eq, sql } from 'drizzle-orm';
import { employees } from './schema';

await db
  .update(employees)
  .set({ salary: sql\`\${employees.salary} + 1\` })
  .where(eq(employees.id, 1))
  .returning({ id: employees.id, name: employees.name, salary: employees.salary });`,
  },
  execute: (db) =>
    db
      .update(employees)
      .set({ salary: sql`${employees.salary} + 1` })
      .where(eq(employees.id, 1))
      .returning({ id: employees.id, name: employees.name, salary: employees.salary }),
};

export default example;
