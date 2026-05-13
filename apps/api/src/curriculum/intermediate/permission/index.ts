import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import type { ModuleDef } from '../../types.ts';
import whoami from './examples/whoami.ts';
import createTempRole from './examples/create-temp-role.ts';
import grantSelectAndVerify from './examples/grant-select-and-verify.ts';
import columnLevelGrant from './examples/column-level-grant.ts';
import setRoleTest from './examples/set-role-test.ts';
import roleInheritance from './examples/role-inheritance.ts';
import rlsEnableAndPolicy from './examples/rls-enable-and-policy.ts';

const here = path.dirname(fileURLToPath(import.meta.url));

const module: ModuleDef = {
  slug: 'permission',
  group: 'intermediate',
  title: '权限与安全',
  order: 7,
  markdown: () => fs.readFileSync(path.join(here, 'index.md'), 'utf8'),
  seedSql: () => fs.readFileSync(path.join(here, 'seed.sql'), 'utf8'),
  examples: [
    whoami,
    createTempRole,
    grantSelectAndVerify,
    columnLevelGrant,
    setRoleTest,
    roleInheritance,
    rlsEnableAndPolicy,
  ],
};

export default module;
