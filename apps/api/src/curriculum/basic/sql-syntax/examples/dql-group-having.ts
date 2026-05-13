import { avg, sql } from 'drizzle-orm';
import type { ExampleDef } from '../../../types.ts';
import { employees } from '../schema.ts';

const example: ExampleDef = {
  id: 'dql-group-having',
  title: 'GROUP BY + HAVING — 高薪部门',
  support: 'full',
  display: {
    sql: `SELECT dept,
       avg(salary) AS avg_salary
FROM   employees
GROUP BY dept
HAVING avg(salary) > 5000
ORDER BY avg_salary DESC;`,
    drizzle: `import { avg, sql } from 'drizzle-orm';
import { employees } from './schema';

await db
  .select({
    dept: employees.dept,
    avgSalary: avg(employees.salary).as('avg_salary'),
  })
  .from(employees)
  .groupBy(employees.dept)
  .having(sql\`avg(\${employees.salary}) > 5000\`)
  .orderBy(sql\`avg_salary DESC\`);`,
  },
  execute: (db) =>
    db
      .select({
        dept: employees.dept,
        avgSalary: avg(employees.salary).as('avg_salary'),
      })
      .from(employees)
      .groupBy(employees.dept)
      .having(sql`avg(${employees.salary}) > 5000`)
      .orderBy(sql`avg_salary DESC`),
};

export default example;
