import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import type { ModuleDef } from '../../types.ts';
import explainPlain from './examples/explain-plain.ts';
import explainAnalyzeBuffers from './examples/explain-analyze-buffers.ts';
import explainFormatJson from './examples/explain-format-json.ts';
import forceSeqScan from './examples/force-seq-scan.ts';
import indexScan from './examples/index-scan.ts';
import bitmapScanOr from './examples/bitmap-scan-or.ts';
import nestedLoopSmall from './examples/nested-loop-small.ts';
import hashJoinLarge from './examples/hash-join-large.ts';
import aggHash from './examples/agg-hash.ts';
import sortThenLimit from './examples/sort-then-limit.ts';
import indexSkipsSort from './examples/index-skips-sort.ts';
import analyzeTable from './examples/analyze-table.ts';
import pgStatsInspect from './examples/pg-stats-inspect.ts';
import functionOnColumnBlocksIndex from './examples/function-on-column-blocks-index.ts';
import implicitCastBlocksIndex from './examples/implicit-cast-blocks-index.ts';

const here = path.dirname(fileURLToPath(import.meta.url));

const module: ModuleDef = {
  slug: 'performance',
  group: 'advanced',
  title: '查询优化与执行计划',
  order: 1,
  markdown: () => fs.readFileSync(path.join(here, 'index.md'), 'utf8'),
  seedSql: () => fs.readFileSync(path.join(here, 'seed.sql'), 'utf8'),
  examples: [
    explainPlain,
    explainAnalyzeBuffers,
    explainFormatJson,
    forceSeqScan,
    indexScan,
    bitmapScanOr,
    nestedLoopSmall,
    hashJoinLarge,
    aggHash,
    sortThenLimit,
    indexSkipsSort,
    analyzeTable,
    pgStatsInspect,
    functionOnColumnBlocksIndex,
    implicitCastBlocksIndex,
  ],
};

export default module;
