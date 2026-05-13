import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import type { ModuleDef } from '../../types.ts';
import showVsCurrentSetting from './examples/show-vs-current-setting.ts';
import setLocalEffect from './examples/set-local-effect.ts';
import pgSettingsSource from './examples/pg-settings-source.ts';
import showAllMemoryParams from './examples/show-all-memory-params.ts';
import showCostParams from './examples/show-cost-params.ts';
import setLocalRandomPageCost from './examples/set-local-random-page-cost.ts';
import showConnectionParams from './examples/show-connection-params.ts';
import setLocalStatementTimeout from './examples/set-local-statement-timeout.ts';
import clientSidePoolComparison from './examples/client-side-pool-comparison.ts';

const here = path.dirname(fileURLToPath(import.meta.url));

const module: ModuleDef = {
  slug: 'config-tuning',
  group: 'advanced',
  title: '配置与调优',
  order: 5,
  markdown: () => fs.readFileSync(path.join(here, 'index.md'), 'utf8'),
  seedSql: () => fs.readFileSync(path.join(here, 'seed.sql'), 'utf8'),
  examples: [
    showVsCurrentSetting,
    setLocalEffect,
    pgSettingsSource,
    showAllMemoryParams,
    showCostParams,
    setLocalRandomPageCost,
    showConnectionParams,
    setLocalStatementTimeout,
    clientSidePoolComparison,
  ],
};

export default module;
