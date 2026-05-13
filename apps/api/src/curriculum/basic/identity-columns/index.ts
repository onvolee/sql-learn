import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import type { ModuleDef } from '../../types.ts';
import serialInsertDefault from './examples/serial-insert-default.ts';
import serialCurrval from './examples/serial-currval.ts';
import identityDefaultInsert from './examples/identity-default-insert.ts';
import identityExplicitOverride from './examples/identity-explicit-override.ts';
import identityAlwaysRejects from './examples/identity-always-rejects.ts';
import uuidDefaultInsert from './examples/uuid-default-insert.ts';
import uuidExplicit from './examples/uuid-explicit.ts';
import seqCreateUse from './examples/seq-create-use.ts';
import seqCurrval from './examples/seq-currval.ts';
import seqInspect from './examples/seq-inspect.ts';

const here = path.dirname(fileURLToPath(import.meta.url));

const module: ModuleDef = {
  slug: 'identity-columns',
  group: 'basic',
  title: '自增与标识列',
  order: 6,
  markdown: () => fs.readFileSync(path.join(here, 'index.md'), 'utf8'),
  seedSql: () => fs.readFileSync(path.join(here, 'seed.sql'), 'utf8'),
  examples: [
    serialInsertDefault,
    serialCurrval,
    identityDefaultInsert,
    identityExplicitOverride,
    identityAlwaysRejects,
    uuidDefaultInsert,
    uuidExplicit,
    seqCreateUse,
    seqCurrval,
    seqInspect,
  ],
};

export default module;
