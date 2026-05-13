import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import type { ModuleDef } from '../../types.ts';
import inspectTableShape from './examples/inspect-table-shape.ts';
import inspectColumns from './examples/inspect-columns.ts';
import countRows from './examples/count-rows.ts';
import pkViolation from './examples/pk-violation.ts';
import fkInsertOk from './examples/fk-insert-ok.ts';
import fkViolation from './examples/fk-violation.ts';
import inspectConstraints from './examples/inspect-constraints.ts';
import inspectDefaultIndex from './examples/inspect-default-index.ts';
import createIndexOnTitle from './examples/create-index-on-title.ts';
import indexIsSeparateObject from './examples/index-is-separate-object.ts';
import listSchemas from './examples/list-schemas.ts';
import currentSchemaOfThisModule from './examples/current-schema-of-this-module.ts';
import qualifiedVsUnqualified from './examples/qualified-vs-unqualified.ts';

const here = path.dirname(fileURLToPath(import.meta.url));

const module: ModuleDef = {
  slug: 'relational-basics',
  group: 'basic',
  title: '关系型数据库基础概念',
  order: 1,
  markdown: () => fs.readFileSync(path.join(here, 'index.md'), 'utf8'),
  seedSql: () => fs.readFileSync(path.join(here, 'seed.sql'), 'utf8'),
  examples: [
    inspectTableShape,
    inspectColumns,
    countRows,
    pkViolation,
    fkInsertOk,
    fkViolation,
    inspectConstraints,
    inspectDefaultIndex,
    createIndexOnTitle,
    indexIsSeparateObject,
    listSchemas,
    currentSchemaOfThisModule,
    qualifiedVsUnqualified,
  ],
};

export default module;
