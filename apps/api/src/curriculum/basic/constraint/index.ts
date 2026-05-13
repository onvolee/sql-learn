import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import type { ModuleDef } from '../../types.ts';
import pkCompositeViolation from './examples/pk-composite-violation.ts';
import fkCascadeDelete from './examples/fk-cascade-delete.ts';
import notNullViolation from './examples/not-null-violation.ts';
import uniqueViolation from './examples/unique-violation.ts';
import uniqueNullsAllowed from './examples/unique-nulls-allowed.ts';
import checkViolationNegativeTotal from './examples/check-violation-negative-total.ts';
import checkViolationZeroQty from './examples/check-violation-zero-qty.ts';
import defaultStatusPending from './examples/default-status-pending.ts';
import deferrableSwapKeys from './examples/deferrable-swap-keys.ts';

const here = path.dirname(fileURLToPath(import.meta.url));

const module: ModuleDef = {
  slug: 'constraint',
  group: 'basic',
  title: '约束',
  order: 7,
  markdown: () => fs.readFileSync(path.join(here, 'index.md'), 'utf8'),
  seedSql: () => fs.readFileSync(path.join(here, 'seed.sql'), 'utf8'),
  examples: [
    pkCompositeViolation,
    fkCascadeDelete,
    notNullViolation,
    uniqueViolation,
    uniqueNullsAllowed,
    checkViolationNegativeTotal,
    checkViolationZeroQty,
    defaultStatusPending,
    deferrableSwapKeys,
  ],
};

export default module;
