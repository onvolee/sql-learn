import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import type { ModuleDef } from '../../types.ts';
import showReplicationRole from './examples/show-replication-role.ts';
import pgStatReplication from './examples/pg-stat-replication.ts';
import replicationSlots from './examples/replication-slots.ts';
import showSyncParams from './examples/show-sync-params.ts';
import walLevelCheck from './examples/wal-level-check.ts';
import pgPublicationList from './examples/pg-publication-list.ts';
import pgSubscriptionList from './examples/pg-subscription-list.ts';
import inspectDecodingPlugins from './examples/inspect-decoding-plugins.ts';
import targetSessionAttrsNote from './examples/target-session-attrs-note.ts';

const here = path.dirname(fileURLToPath(import.meta.url));

const module: ModuleDef = {
  slug: 'replication',
  group: 'advanced',
  title: '复制与高可用',
  order: 6,
  markdown: () => fs.readFileSync(path.join(here, 'index.md'), 'utf8'),
  seedSql: () => fs.readFileSync(path.join(here, 'seed.sql'), 'utf8'),
  examples: [
    showReplicationRole,
    pgStatReplication,
    replicationSlots,
    showSyncParams,
    walLevelCheck,
    pgPublicationList,
    pgSubscriptionList,
    inspectDecodingPlugins,
    targetSessionAttrsNote,
  ],
};

export default module;
