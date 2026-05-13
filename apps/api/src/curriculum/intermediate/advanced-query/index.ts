import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import type { ModuleDef } from '../../types.ts';
import joinInner from './examples/join-inner.ts';
import joinLeftFindNoOrders from './examples/join-left-find-no-orders.ts';
import joinFull from './examples/join-full.ts';
import joinCross from './examples/join-cross.ts';
import joinLateral from './examples/join-lateral.ts';
import subqueryScalar from './examples/subquery-scalar.ts';
import subqueryDerived from './examples/subquery-derived.ts';
import subqueryCorrelated from './examples/subquery-correlated.ts';
import existsCustomersWithOrders from './examples/exists-customers-with-orders.ts';
import inProductsOrdered from './examples/in-products-ordered.ts';
import anyPriceGreater from './examples/any-price-greater.ts';
import unionAllVsUnion from './examples/union-all-vs-union.ts';
import intersectCustomersBuyingAAndB from './examples/intersect-customers-buying-a-and-b.ts';
import exceptCustomersNoOrders from './examples/except-customers-no-orders.ts';
import cteBasic from './examples/cte-basic.ts';
import cteRecursiveSeries from './examples/cte-recursive-series.ts';
import windowRowNumber from './examples/window-row-number.ts';
import windowRankDense from './examples/window-rank-dense.ts';
import windowLagDiff from './examples/window-lag-diff.ts';
import windowRunningSum from './examples/window-running-sum.ts';

const here = path.dirname(fileURLToPath(import.meta.url));

const module: ModuleDef = {
  slug: 'advanced-query',
  group: 'intermediate',
  title: '高级查询',
  order: 1,
  markdown: () => fs.readFileSync(path.join(here, 'index.md'), 'utf8'),
  seedSql: () => fs.readFileSync(path.join(here, 'seed.sql'), 'utf8'),
  examples: [
    joinInner,
    joinLeftFindNoOrders,
    joinFull,
    joinCross,
    joinLateral,
    subqueryScalar,
    subqueryDerived,
    subqueryCorrelated,
    existsCustomersWithOrders,
    inProductsOrdered,
    anyPriceGreater,
    unionAllVsUnion,
    intersectCustomersBuyingAAndB,
    exceptCustomersNoOrders,
    cteBasic,
    cteRecursiveSeries,
    windowRowNumber,
    windowRankDense,
    windowLagDiff,
    windowRunningSum,
  ],
};

export default module;
