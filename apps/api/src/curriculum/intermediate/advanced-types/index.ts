import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import type { ModuleDef } from '../../types.ts';
import arrayInsert from './examples/array-insert.ts';
import arrayOperators from './examples/array-operators.ts';
import arrayUnnest from './examples/array-unnest.ts';
import arrayAgg from './examples/array-agg.ts';
import rangeOverlap from './examples/range-overlap.ts';
import rangeContainsPoint from './examples/range-contains-point.ts';
import excludeNoOverlap from './examples/exclude-no-overlap.ts';
import generatedColumnRead from './examples/generated-column-read.ts';
import generatedColumnWriteFails from './examples/generated-column-write-fails.ts';
import domainDefineAndUse from './examples/domain-define-and-use.ts';
import enumDefineAndUse from './examples/enum-define-and-use.ts';
import enumAddValue from './examples/enum-add-value.ts';

const here = path.dirname(fileURLToPath(import.meta.url));

const module: ModuleDef = {
  slug: 'advanced-types',
  group: 'intermediate',
  title: '高级数据类型',
  order: 8,
  markdown: () => fs.readFileSync(path.join(here, 'index.md'), 'utf8'),
  seedSql: () => fs.readFileSync(path.join(here, 'seed.sql'), 'utf8'),
  examples: [
    arrayInsert,
    arrayOperators,
    arrayUnnest,
    arrayAgg,
    rangeOverlap,
    rangeContainsPoint,
    excludeNoOverlap,
    generatedColumnRead,
    generatedColumnWriteFails,
    domainDefineAndUse,
    enumDefineAndUse,
    enumAddValue,
  ],
};

export default module;
