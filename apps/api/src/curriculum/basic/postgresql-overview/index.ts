import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import type { ModuleDef } from '../../types.ts';
import showVersion from './examples/show-version.ts';
import showEncoding from './examples/show-encoding.ts';
import showTimezone from './examples/show-timezone.ts';
import txSavepointDemo from './examples/tx-savepoint-demo.ts';
import inspectXmin from './examples/inspect-xmin.ts';
import arrayColumn from './examples/array-column.ts';
import jsonbColumn from './examples/jsonb-column.ts';

const here = path.dirname(fileURLToPath(import.meta.url));

const module: ModuleDef = {
  slug: 'postgresql-overview',
  group: 'basic',
  title: 'PostgreSQL 概述',
  order: 2,
  markdown: () => fs.readFileSync(path.join(here, 'index.md'), 'utf8'),
  seedSql: () => fs.readFileSync(path.join(here, 'seed.sql'), 'utf8'),
  examples: [
    showVersion,
    showEncoding,
    showTimezone,
    txSavepointDemo,
    inspectXmin,
    arrayColumn,
    jsonbColumn,
  ],
};

export default module;
