import { sql } from 'drizzle-orm';
import type { ExampleDef } from '../../../types.ts';

const example: ExampleDef = {
  id: 'ddl-alter-rename-column',
  title: 'ALTER TABLE — 改列名',
  support: 'partial',
  display: {
    sql: `-- 用 DO 块保证可重入：name 在则改成 full_name，否则跳过
DO $$
BEGIN
  IF EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_schema = current_schema()
      AND table_name   = 'employees_archive'
      AND column_name  = 'name'
  ) THEN
    ALTER TABLE employees_archive RENAME COLUMN name TO full_name;
  END IF;
END $$;

SELECT column_name
FROM information_schema.columns
WHERE table_schema = current_schema()
  AND table_name   = 'employees_archive'
ORDER BY ordinal_position;`,
    drizzle: `import { sql } from 'drizzle-orm';

await db.execute(sql\`
  DO $$
  BEGIN
    IF EXISTS (
      SELECT 1 FROM information_schema.columns
      WHERE table_schema = current_schema()
        AND table_name   = 'employees_archive'
        AND column_name  = 'name'
    ) THEN
      ALTER TABLE employees_archive RENAME COLUMN name TO full_name;
    END IF;
  END $$
\`);

await db.execute(sql\`
  SELECT column_name
  FROM information_schema.columns
  WHERE table_schema = current_schema()
    AND table_name   = 'employees_archive'
  ORDER BY ordinal_position
\`);`,
  },
  execute: async (db) => {
    await db.execute(sql`
      DO $$
      BEGIN
        IF EXISTS (
          SELECT 1 FROM information_schema.columns
          WHERE table_schema = current_schema()
            AND table_name   = 'employees_archive'
            AND column_name  = 'name'
        ) THEN
          ALTER TABLE employees_archive RENAME COLUMN name TO full_name;
        END IF;
      END $$
    `);
    return db.execute(sql`
      SELECT column_name
      FROM information_schema.columns
      WHERE table_schema = current_schema()
        AND table_name   = 'employees_archive'
      ORDER BY ordinal_position
    `);
  },
};

export default example;
