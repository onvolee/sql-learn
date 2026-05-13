import { sql } from 'drizzle-orm';
import type { ExampleDef } from '../../../types.ts';

const example: ExampleDef = {
  id: 'fn-define-inline',
  title: '在 example 里临时定义函数',
  support: 'partial',
  display: {
    sql: `CREATE OR REPLACE FUNCTION fn_product_avg(p text)
RETURNS numeric
LANGUAGE plpgsql
AS $$
DECLARE
  avg_amount numeric;
BEGIN
  SELECT avg(amount) INTO avg_amount
  FROM sales
  WHERE product = p;
  RETURN round(coalesce(avg_amount, 0), 2);
END;
$$;

SELECT fn_product_avg('keyboard') AS keyboard_avg,
       fn_product_avg('laptop')   AS laptop_avg;

DROP FUNCTION IF EXISTS fn_product_avg(text);`,
    drizzle: `import { sql } from 'drizzle-orm';

await db.execute(sql\`
  CREATE OR REPLACE FUNCTION fn_product_avg(p text)
  RETURNS numeric
  LANGUAGE plpgsql
  AS $$
  DECLARE
    avg_amount numeric;
  BEGIN
    SELECT avg(amount) INTO avg_amount
    FROM sales
    WHERE product = p;
    RETURN round(coalesce(avg_amount, 0), 2);
  END;
  $$
\`);

const rows = await db.execute(sql\`
  SELECT fn_product_avg('keyboard') AS keyboard_avg,
         fn_product_avg('laptop')   AS laptop_avg
\`);

await db.execute(sql\`DROP FUNCTION IF EXISTS fn_product_avg(text)\`);
return rows;`,
  },
  execute: async (db) => {
    await db.execute(sql`
      CREATE OR REPLACE FUNCTION fn_product_avg(p text)
      RETURNS numeric
      LANGUAGE plpgsql
      AS $$
      DECLARE
        avg_amount numeric;
      BEGIN
        SELECT avg(amount) INTO avg_amount
        FROM sales
        WHERE product = p;
        RETURN round(coalesce(avg_amount, 0), 2);
      END;
      $$
    `);
    const rows = await db.execute(sql`
      SELECT fn_product_avg('keyboard') AS keyboard_avg,
             fn_product_avg('laptop')   AS laptop_avg
    `);
    await db.execute(sql`DROP FUNCTION IF EXISTS fn_product_avg(text)`);
    return rows;
  },
};

export default example;
