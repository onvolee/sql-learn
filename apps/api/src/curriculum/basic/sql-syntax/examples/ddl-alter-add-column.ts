import { sql } from 'drizzle-orm';
import type { ExampleDef } from '../../../types.ts';

const example: ExampleDef = {
  id: 'ddl-alter-add-column',
  title: 'ALTER TABLE — 加一列',
  support: 'partial',
  display: {
    sql: `ALTER TABLE employees_archive
  ADD COLUMN IF NOT EXISTS archived_at timestamptz DEFAULT now();

SELECT column_name, data_type
FROM information_schema.columns
WHERE table_schema = current_schema()
  AND table_name   = 'employees_archive'
  AND column_name  = 'archived_at';`,
    drizzle: `import { sql } from 'drizzle-orm';

await db.execute(sql\`
  ALTER TABLE employees_archive
    ADD COLUMN IF NOT EXISTS archived_at timestamptz DEFAULT now()
\`);

await db.execute(sql\`
  SELECT column_name, data_type
  FROM information_schema.columns
  WHERE table_schema = current_schema()
    AND table_name   = 'employees_archive'
    AND column_name  = 'archived_at'
\`);`,
  },
  execute: async (db) => {
    await db.execute(sql`
      ALTER TABLE employees_archive
        ADD COLUMN IF NOT EXISTS archived_at timestamptz DEFAULT now()
    `);
    return db.execute(sql`
      SELECT column_name, data_type
      FROM information_schema.columns
      WHERE table_schema = current_schema()
        AND table_name   = 'employees_archive'
        AND column_name  = 'archived_at'
    `);
  },
};

export default example;
