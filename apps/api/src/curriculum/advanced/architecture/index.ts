import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import type { ModuleDef } from '../../types.ts';
import listBackendProcs from './examples/list-backend-procs.ts';
import versionInfo from './examples/version-info.ts';
import showMemoryParams from './examples/show-memory-params.ts';
import relationFilepath from './examples/relation-filepath.ts';
import tableToastAndSize from './examples/table-toast-and-size.ts';
import inspectSystemColumns from './examples/inspect-system-columns.ts';
import walCurrentLsn from './examples/wal-current-lsn.ts';
import walRelatedParams from './examples/wal-related-params.ts';

const here = path.dirname(fileURLToPath(import.meta.url));

const module: ModuleDef = {
  slug: 'architecture',
  group: 'advanced',
  title: 'PostgreSQL 体系结构',
  order: 4,
  markdown: () => fs.readFileSync(path.join(here, 'index.md'), 'utf8'),
  seedSql: () => fs.readFileSync(path.join(here, 'seed.sql'), 'utf8'),
  examples: [
    listBackendProcs,
    versionInfo,
    showMemoryParams,
    relationFilepath,
    tableToastAndSize,
    inspectSystemColumns,
    walCurrentLsn,
    walRelatedParams,
  ],
};

export default module;
