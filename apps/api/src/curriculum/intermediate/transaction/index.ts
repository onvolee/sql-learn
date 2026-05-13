import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import type { ModuleDef } from '../../types.ts';
import acidAtomicityDemo from './examples/acid-atomicity-demo.ts';
import savepointRollbackTo from './examples/savepoint-rollback-to.ts';
import savepointRelease from './examples/savepoint-release.ts';
import showDefaultIsolation from './examples/show-default-isolation.ts';
import setIsolationRepeatableRead from './examples/set-isolation-repeatable-read.ts';
import mvccInspectXmin from './examples/mvcc-inspect-xmin.ts';
import mvccUpdateCreatesNewVersion from './examples/mvcc-update-creates-new-version.ts';
import rowLockForUpdate from './examples/row-lock-for-update.ts';
import advisoryLockAcquireRelease from './examples/advisory-lock-acquire-release.ts';
import inspectPgLocks from './examples/inspect-pg-locks.ts';
import deadlockTimeoutSetting from './examples/deadlock-timeout-setting.ts';

const here = path.dirname(fileURLToPath(import.meta.url));

const module: ModuleDef = {
  slug: 'transaction',
  group: 'intermediate',
  title: '事务与并发',
  order: 3,
  markdown: () => fs.readFileSync(path.join(here, 'index.md'), 'utf8'),
  seedSql: () => fs.readFileSync(path.join(here, 'seed.sql'), 'utf8'),
  examples: [
    acidAtomicityDemo,
    savepointRollbackTo,
    savepointRelease,
    showDefaultIsolation,
    setIsolationRepeatableRead,
    mvccInspectXmin,
    mvccUpdateCreatesNewVersion,
    rowLockForUpdate,
    advisoryLockAcquireRelease,
    inspectPgLocks,
    deadlockTimeoutSetting,
  ],
};

export default module;
