import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import type { ModuleDef } from '../../types.ts';
import inspectOrders from './examples/inspect-orders.ts';
import copyToStdout from './examples/copy-to-stdout.ts';
import copyFormatComparison from './examples/copy-format-comparison.ts';
import pgdataLocation from './examples/pgdata-location.ts';
import showArchiveParams from './examples/show-archive-params.ts';
import currentWalPosition from './examples/current-wal-position.ts';
import exportSnapshot from './examples/export-snapshot.ts';
import availableExtensionsNote from './examples/available-extensions-note.ts';

const here = path.dirname(fileURLToPath(import.meta.url));

const module: ModuleDef = {
  slug: 'backup-restore',
  group: 'advanced',
  title: '备份与恢复',
  order: 8,
  markdown: () => fs.readFileSync(path.join(here, 'index.md'), 'utf8'),
  seedSql: () => fs.readFileSync(path.join(here, 'seed.sql'), 'utf8'),
  examples: [
    inspectOrders,
    copyToStdout,
    copyFormatComparison,
    pgdataLocation,
    showArchiveParams,
    currentWalPosition,
    exportSnapshot,
    availableExtensionsNote,
  ],
};

export default module;
