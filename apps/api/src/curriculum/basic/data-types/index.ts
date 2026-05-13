import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import type { ModuleDef } from '../../types.ts';
import numericPrecision from './examples/numeric-precision.ts';
import realVsNumericMoney from './examples/real-vs-numeric-money.ts';
import integerOverflow from './examples/integer-overflow.ts';
import charPadsSpaces from './examples/char-pads-spaces.ts';
import varcharLengthLimit from './examples/varchar-length-limit.ts';
import textNoLimit from './examples/text-no-limit.ts';
import nowVsCurrentDate from './examples/now-vs-current-date.ts';
import timestampTzDifference from './examples/timestamp-tz-difference.ts';
import intervalArithmetic from './examples/interval-arithmetic.ts';
import boolThreeValues from './examples/bool-three-values.ts';
import uuidGenerate from './examples/uuid-generate.ts';
import jsonbLiteral from './examples/jsonb-literal.ts';
import arrayLiteral from './examples/array-literal.ts';
import rangeLiteral from './examples/range-literal.ts';

const here = path.dirname(fileURLToPath(import.meta.url));

const module: ModuleDef = {
  slug: 'data-types',
  group: 'basic',
  title: '数据类型',
  order: 5,
  markdown: () => fs.readFileSync(path.join(here, 'index.md'), 'utf8'),
  seedSql: () => fs.readFileSync(path.join(here, 'seed.sql'), 'utf8'),
  examples: [
    numericPrecision,
    realVsNumericMoney,
    integerOverflow,
    charPadsSpaces,
    varcharLengthLimit,
    textNoLimit,
    nowVsCurrentDate,
    timestampTzDifference,
    intervalArithmetic,
    boolThreeValues,
    uuidGenerate,
    jsonbLiteral,
    arrayLiteral,
    rangeLiteral,
  ],
};

export default module;
