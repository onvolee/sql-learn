import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import type { ModuleDef } from '../../types.ts';
import viewSelect from './examples/view-select.ts';
import viewReplace from './examples/view-replace.ts';
import viewDropRecreate from './examples/view-drop-recreate.ts';
import mvSelect from './examples/mv-select.ts';
import mvRefresh from './examples/mv-refresh.ts';
import mvRefreshConcurrently from './examples/mv-refresh-concurrently.ts';
import fnCall from './examples/fn-call.ts';
import fnDefineInline from './examples/fn-define-inline.ts';
import fnInspectSource from './examples/fn-inspect-source.ts';
import triggerAuditOnInsert from './examples/trigger-audit-on-insert.ts';
import triggerInspect from './examples/trigger-inspect.ts';
import eventTriggerList from './examples/event-trigger-list.ts';

const here = path.dirname(fileURLToPath(import.meta.url));

const module: ModuleDef = {
  slug: 'view-function',
  group: 'intermediate',
  title: '视图与函数',
  order: 4,
  markdown: () => fs.readFileSync(path.join(here, 'index.md'), 'utf8'),
  seedSql: () => fs.readFileSync(path.join(here, 'seed.sql'), 'utf8'),
  examples: [
    viewSelect,
    viewReplace,
    viewDropRecreate,
    mvSelect,
    mvRefresh,
    mvRefreshConcurrently,
    fnCall,
    fnDefineInline,
    fnInspectSource,
    triggerAuditOnInsert,
    triggerInspect,
    eventTriggerList,
  ],
};

export default module;
