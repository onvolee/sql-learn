import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import type { ModuleDef } from '../../types.ts';
import inspectDeadTuplesBefore from './examples/inspect-dead-tuples-before.ts';
import makeDeadTuples from './examples/make-dead-tuples.ts';
import vacuumBasic from './examples/vacuum-basic.ts';
import vacuumVerbose from './examples/vacuum-verbose.ts';
import relationSizeBeforeAfterFull from './examples/relation-size-before-after-full.ts';
import showAutovacuumSettings from './examples/show-autovacuum-settings.ts';
import lastAutovacuumTime from './examples/last-autovacuum-time.ts';
import setTableAutovacuumAggressive from './examples/set-table-autovacuum-aggressive.ts';
import showFreezeParams from './examples/show-freeze-params.ts';
import inspectRelfrozenxid from './examples/inspect-relfrozenxid.ts';
import reindexTable from './examples/reindex-table.ts';
import inspectIndexSize from './examples/inspect-index-size.ts';

const here = path.dirname(fileURLToPath(import.meta.url));

const module: ModuleDef = {
  slug: 'vacuum',
  group: 'advanced',
  title: 'VACUUM 与表膨胀',
  order: 2,
  markdown: () => fs.readFileSync(path.join(here, 'index.md'), 'utf8'),
  seedSql: () => fs.readFileSync(path.join(here, 'seed.sql'), 'utf8'),
  examples: [
    inspectDeadTuplesBefore,
    makeDeadTuples,
    vacuumBasic,
    vacuumVerbose,
    relationSizeBeforeAfterFull,
    showAutovacuumSettings,
    lastAutovacuumTime,
    setTableAutovacuumAggressive,
    showFreezeParams,
    inspectRelfrozenxid,
    reindexTable,
    inspectIndexSize,
  ],
};

export default module;
