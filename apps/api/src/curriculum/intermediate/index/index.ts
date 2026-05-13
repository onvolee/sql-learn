import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import type { ModuleDef } from '../../types.ts';
import btreeCreateAndExplain from './examples/btree-create-and-explain.ts';
import btreeRangeScan from './examples/btree-range-scan.ts';
import hashCreateAndExplain from './examples/hash-create-and-explain.ts';
import ginJsonb from './examples/gin-jsonb.ts';
import ginArray from './examples/gin-array.ts';
import gistRangeOverlap from './examples/gist-range-overlap.ts';
import brinOnTs from './examples/brin-on-ts.ts';
import brinVsBtreeSize from './examples/brin-vs-btree-size.ts';
import partialIndex from './examples/partial-index.ts';
import expressionIndex from './examples/expression-index.ts';
import coveringIndex from './examples/covering-index.ts';
import uniqueIndexAsConstraint from './examples/unique-index-as-constraint.ts';

const here = path.dirname(fileURLToPath(import.meta.url));

const module: ModuleDef = {
  slug: 'index',
  group: 'intermediate',
  title: '索引',
  order: 2,
  markdown: () => fs.readFileSync(path.join(here, 'index.md'), 'utf8'),
  seedSql: () => fs.readFileSync(path.join(here, 'seed.sql'), 'utf8'),
  examples: [
    btreeCreateAndExplain,
    btreeRangeScan,
    hashCreateAndExplain,
    ginJsonb,
    ginArray,
    gistRangeOverlap,
    brinOnTs,
    brinVsBtreeSize,
    partialIndex,
    expressionIndex,
    coveringIndex,
    uniqueIndexAsConstraint,
  ],
};

export default module;
