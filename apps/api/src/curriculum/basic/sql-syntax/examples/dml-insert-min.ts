import type { ExampleDef } from '../../../types.ts';
import { employees } from '../schema.ts';

const example: ExampleDef = {
  id: 'dml-insert-min',
  title: 'INSERT — 最小写入',
  support: 'full',
  display: {
    sql: `INSERT INTO employees (id, name, dept, salary)
VALUES (101, 'newcomer', 'engineering', 7000.00)
ON CONFLICT (id) DO NOTHING
RETURNING id, name, dept, salary;`,
    drizzle: `import { employees } from './schema';

await db
  .insert(employees)
  .values({ id: 101, name: 'newcomer', dept: 'engineering', salary: '7000.00' })
  .onConflictDoNothing()
  .returning();`,
  },
  execute: (db) =>
    db
      .insert(employees)
      .values({ id: 101, name: 'newcomer', dept: 'engineering', salary: '7000.00' })
      .onConflictDoNothing()
      .returning(),
};

export default example;
