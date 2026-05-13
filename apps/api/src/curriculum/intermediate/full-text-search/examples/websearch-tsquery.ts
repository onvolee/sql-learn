import { sql } from 'drizzle-orm';
import type { ExampleDef } from '../../../types.ts';

const example: ExampleDef = {
  id: 'websearch-tsquery',
  title: 'websearch_to_tsquery：Google 风格输入',
  support: 'partial',
  display: {
    sql: `SELECT
  websearch_to_tsquery('english', '"quick fox" -lazy')          AS phrase_minus,
  websearch_to_tsquery('english', 'postgres or mysql -oracle')  AS or_minus,
  websearch_to_tsquery('english', 'index !!! ??? "scan"')       AS forgiving;`,
    drizzle: `import { sql } from 'drizzle-orm';

await db.execute(sql\`
  SELECT
    websearch_to_tsquery('english', '"quick fox" -lazy')          AS phrase_minus,
    websearch_to_tsquery('english', 'postgres or mysql -oracle')  AS or_minus,
    websearch_to_tsquery('english', 'index !!! ??? "scan"')       AS forgiving
\`);`,
  },
  execute: (db) =>
    db.execute(sql`
      SELECT
        websearch_to_tsquery('english', '"quick fox" -lazy')          AS phrase_minus,
        websearch_to_tsquery('english', 'postgres or mysql -oracle')  AS or_minus,
        websearch_to_tsquery('english', 'index !!! ??? "scan"')       AS forgiving
    `),
};

export default example;
