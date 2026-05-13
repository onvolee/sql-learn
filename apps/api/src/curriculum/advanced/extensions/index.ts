import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import type { ModuleDef } from '../../types.ts';
import listAvailableExtensions from './examples/list-available-extensions.ts';
import listInstalledExtensions from './examples/list-installed-extensions.ts';
import pgStatStatementsAvailability from './examples/pg-stat-statements-availability.ts';
import pgvectorAvailability from './examples/pgvector-availability.ts';
import pgvectorDemo from './examples/pgvector-demo.ts';
import postgisAvailability from './examples/postgis-availability.ts';
import timescaledbAvailability from './examples/timescaledb-availability.ts';
import pgTrgmAvailability from './examples/pg-trgm-availability.ts';
import pgTrgmSimilarity from './examples/pg-trgm-similarity.ts';
import pgCronAvailability from './examples/pg-cron-availability.ts';
import pgcryptoAvailability from './examples/pgcrypto-availability.ts';
import pgcryptoDigestUuid from './examples/pgcrypto-digest-uuid.ts';
import hypopgAvailability from './examples/hypopg-availability.ts';

const here = path.dirname(fileURLToPath(import.meta.url));

const module: ModuleDef = {
  slug: 'extensions',
  group: 'advanced',
  title: '扩展与生态',
  order: 9,
  markdown: () => fs.readFileSync(path.join(here, 'index.md'), 'utf8'),
  seedSql: () => fs.readFileSync(path.join(here, 'seed.sql'), 'utf8'),
  examples: [
    listAvailableExtensions,
    listInstalledExtensions,
    pgStatStatementsAvailability,
    pgvectorAvailability,
    pgvectorDemo,
    postgisAvailability,
    timescaledbAvailability,
    pgTrgmAvailability,
    pgTrgmSimilarity,
    pgCronAvailability,
    pgcryptoAvailability,
    pgcryptoDigestUuid,
    hypopgAvailability,
  ],
};

export default module;
