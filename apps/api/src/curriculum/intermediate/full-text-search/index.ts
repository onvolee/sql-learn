import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import type { ModuleDef } from '../../types.ts';
import tsvectorBasic from './examples/tsvector-basic.ts';
import tsqueryBasic from './examples/tsquery-basic.ts';
import matchOperator from './examples/match-operator.ts';
import plaintoTsquery from './examples/plainto-tsquery.ts';
import websearchTsquery from './examples/websearch-tsquery.ts';
import searchArticles from './examples/search-articles.ts';
import searchWithRank from './examples/search-with-rank.ts';
import ginOnTsvector from './examples/gin-on-tsvector.ts';
import headlineSnippet from './examples/headline-snippet.ts';
import chineseWithoutZhparser from './examples/chinese-without-zhparser.ts';

const here = path.dirname(fileURLToPath(import.meta.url));

const module: ModuleDef = {
  slug: 'full-text-search',
  group: 'intermediate',
  title: '全文搜索',
  order: 6,
  markdown: () => fs.readFileSync(path.join(here, 'index.md'), 'utf8'),
  seedSql: () => fs.readFileSync(path.join(here, 'seed.sql'), 'utf8'),
  examples: [
    tsvectorBasic,
    tsqueryBasic,
    matchOperator,
    plaintoTsquery,
    websearchTsquery,
    searchArticles,
    searchWithRank,
    ginOnTsvector,
    headlineSnippet,
    chineseWithoutZhparser,
  ],
};

export default module;
