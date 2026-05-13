import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import type { ModuleDef } from '../../types.ts';
import inspectStorageDifference from './examples/inspect-storage-difference.ts';
import arrowVsDoubleArrow from './examples/arrow-vs-double-arrow.ts';
import pathOperator from './examples/path-operator.ts';
import containsOperator from './examples/contains-operator.ts';
import keyExists from './examples/key-exists.ts';
import jsonbSetUpdate from './examples/jsonb-set-update.ts';
import jsonbPathQuery from './examples/jsonb-path-query.ts';
import jsonbArrayElementsUnnest from './examples/jsonb-array-elements-unnest.ts';
import ginDefaultOpclass from './examples/gin-default-opclass.ts';
import ginPathOpsOpclass from './examples/gin-path-ops-opclass.ts';

const here = path.dirname(fileURLToPath(import.meta.url));

const module: ModuleDef = {
  slug: 'jsonb',
  group: 'intermediate',
  title: 'JSON 与 JSONB',
  order: 5,
  markdown: () => fs.readFileSync(path.join(here, 'index.md'), 'utf8'),
  seedSql: () => fs.readFileSync(path.join(here, 'seed.sql'), 'utf8'),
  examples: [
    inspectStorageDifference,
    arrowVsDoubleArrow,
    pathOperator,
    containsOperator,
    keyExists,
    jsonbSetUpdate,
    jsonbPathQuery,
    jsonbArrayElementsUnnest,
    ginDefaultOpclass,
    ginPathOpsOpclass,
  ],
};

export default module;
