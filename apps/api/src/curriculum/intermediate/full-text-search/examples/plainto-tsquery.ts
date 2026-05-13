import { sql } from 'drizzle-orm';
import type { ExampleDef } from '../../../types.ts';

const example: ExampleDef = {
  id: 'plainto-tsquery',
  title: 'plainto_tsquery vs to_tsquery',
  support: 'partial',
  display: {
    sql: `SELECT
  plainto_tsquery('english', 'quick fox lazy')   AS plain,
  phraseto_tsquery('english', 'quick brown fox') AS phrase,
  to_tsquery       ('english', 'quick & fox')    AS strict;`,
    drizzle: `import { sql } from 'drizzle-orm';

await db.execute(sql\`
  SELECT
    plainto_tsquery('english', 'quick fox lazy')   AS plain,
    phraseto_tsquery('english', 'quick brown fox') AS phrase,
    to_tsquery       ('english', 'quick & fox')    AS strict
\`);`,
  },
  execute: (db) =>
    db.execute(sql`
      SELECT
        plainto_tsquery('english', 'quick fox lazy')   AS plain,
        phraseto_tsquery('english', 'quick brown fox') AS phrase,
        to_tsquery       ('english', 'quick & fox')    AS strict
    `),
};

export default example;
