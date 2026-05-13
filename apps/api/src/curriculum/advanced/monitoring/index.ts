import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import type { ModuleDef } from '../../types.ts';
import dbLevelStats from './examples/db-level-stats.ts';
import tableScanStats from './examples/table-scan-stats.ts';
import cacheHitRatio from './examples/cache-hit-ratio.ts';
import indexUsage from './examples/index-usage.ts';
import unusedIndexCandidates from './examples/unused-index-candidates.ts';
import currentActivity from './examples/current-activity.ts';
import idleInTransactionDetect from './examples/idle-in-transaction-detect.ts';
import currentLocks from './examples/current-locks.ts';
import blockingChainShape from './examples/blocking-chain-shape.ts';
import pgStatStatementsCheck from './examples/pg-stat-statements-check.ts';
import topSlowStatements from './examples/top-slow-statements.ts';
import showSlowLogThreshold from './examples/show-slow-log-threshold.ts';

const here = path.dirname(fileURLToPath(import.meta.url));

const module: ModuleDef = {
  slug: 'monitoring',
  group: 'advanced',
  title: '监控与诊断',
  order: 3,
  markdown: () => fs.readFileSync(path.join(here, 'index.md'), 'utf8'),
  seedSql: () => fs.readFileSync(path.join(here, 'seed.sql'), 'utf8'),
  examples: [
    dbLevelStats,
    tableScanStats,
    cacheHitRatio,
    indexUsage,
    unusedIndexCandidates,
    currentActivity,
    idleInTransactionDetect,
    currentLocks,
    blockingChainShape,
    pgStatStatementsCheck,
    topSlowStatements,
    showSlowLogThreshold,
  ],
};

export default module;
