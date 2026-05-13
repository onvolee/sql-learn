import { desc } from 'drizzle-orm';
import type { ExampleDef } from '../../../types.ts';
import { employees } from '../schema.ts';

const example: ExampleDef = {
  id: 'dql-order-limit',
  title: 'ORDER BY + LIMIT — 薪资 Top 3',
  support: 'full',
  display: {
    sql: `SELECT id, name, dept, salary
FROM   employees
ORDER BY salary DESC
LIMIT 3;`,
    drizzle: `import { desc } from 'drizzle-orm';
import { employees } from './schema';

await db
  .select({
    id: employees.id,
    name: employees.name,
    dept: employees.dept,
    salary: employees.salary,
  })
  .from(employees)
  .orderBy(desc(employees.salary))
  .limit(3);`,
  },
  execute: (db) =>
    db
      .select({
        id: employees.id,
        name: employees.name,
        dept: employees.dept,
        salary: employees.salary,
      })
      .from(employees)
      .orderBy(desc(employees.salary))
      .limit(3),
};

export default example;
