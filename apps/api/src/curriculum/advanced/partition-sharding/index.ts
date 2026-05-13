import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import type { ModuleDef } from '../../types.ts';
import listPartitionsOfSales from './examples/list-partitions-of-sales.ts';
import listPartitionsOfCustomers from './examples/list-partitions-of-customers.ts';
import partitionPruneExplain from './examples/partition-prune-explain.ts';
import partitionNoPruneNoKey from './examples/partition-no-prune-no-key.ts';
import attachPartition from './examples/attach-partition.ts';
import detachPartition from './examples/detach-partition.ts';
import autoRouteInsert from './examples/auto-route-insert.ts';
import indexOnParentPropagates from './examples/index-on-parent-propagates.ts';
import citusCheck from './examples/citus-check.ts';

const here = path.dirname(fileURLToPath(import.meta.url));

const module: ModuleDef = {
  slug: 'partition-sharding',
  group: 'advanced',
  title: '分区与分片',
  order: 7,
  markdown: () => fs.readFileSync(path.join(here, 'index.md'), 'utf8'),
  seedSql: () => fs.readFileSync(path.join(here, 'seed.sql'), 'utf8'),
  examples: [
    listPartitionsOfSales,
    listPartitionsOfCustomers,
    partitionPruneExplain,
    partitionNoPruneNoKey,
    attachPartition,
    detachPartition,
    autoRouteInsert,
    indexOnParentPropagates,
    citusCheck,
  ],
};

export default module;
