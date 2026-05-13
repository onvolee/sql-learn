import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import type { ModuleDef } from '../../types.ts';
import createTmpSchema from './examples/create-tmp-schema.ts';
import dropTmpSchemaCascade from './examples/drop-tmp-schema-cascade.ts';
import showCurrentSearchPath from './examples/show-current-search-path.ts';
import changeSearchPathEffect from './examples/change-search-path-effect.ts';
import qualifiedNameCrossSchema from './examples/qualified-name-cross-schema.ts';
import listTablesBySchema from './examples/list-tables-by-schema.ts';

const here = path.dirname(fileURLToPath(import.meta.url));

const module: ModuleDef = {
  slug: 'schema-namespace',
  group: 'basic',
  title: 'Schema 与命名空间',
  order: 8,
  markdown: () => fs.readFileSync(path.join(here, 'index.md'), 'utf8'),
  seedSql: () => fs.readFileSync(path.join(here, 'seed.sql'), 'utf8'),
  examples: [
    createTmpSchema,
    dropTmpSchemaCascade,
    showCurrentSearchPath,
    changeSearchPathEffect,
    qualifiedNameCrossSchema,
    listTablesBySchema,
  ],
};

export default module;
