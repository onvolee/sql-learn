import type { ModuleDef } from "./types.ts";

// basic
import relationalBasics from "./basic/relational-basics/index.ts";
import postgresqlOverview from "./basic/postgresql-overview/index.ts";
import psqlCommands from "./basic/psql-commands/index.ts";
import sqlSyntax from "./basic/sql-syntax/index.ts";
import dataTypes from "./basic/data-types/index.ts";
import identityColumns from "./basic/identity-columns/index.ts";
import constraint from "./basic/constraint/index.ts";
import schemaNamespace from "./basic/schema-namespace/index.ts";

// intermediate
import advancedQuery from "./intermediate/advanced-query/index.ts";
import indexModule from "./intermediate/index/index.ts";
import transaction from "./intermediate/transaction/index.ts";
import viewFunction from "./intermediate/view-function/index.ts";
import jsonb from "./intermediate/jsonb/index.ts";
import fullTextSearch from "./intermediate/full-text-search/index.ts";
import permission from "./intermediate/permission/index.ts";
import advancedTypes from "./intermediate/advanced-types/index.ts";

// advanced
import performance from "./advanced/performance/index.ts";
import vacuum from "./advanced/vacuum/index.ts";
import monitoring from "./advanced/monitoring/index.ts";
import architecture from "./advanced/architecture/index.ts";
import configTuning from "./advanced/config-tuning/index.ts";
import replication from "./advanced/replication/index.ts";
import partitionSharding from "./advanced/partition-sharding/index.ts";
import backupRestore from "./advanced/backup-restore/index.ts";
import extensions from "./advanced/extensions/index.ts";

const all: ModuleDef[] = [
  // basic
  relationalBasics,
  postgresqlOverview,
  psqlCommands,
  sqlSyntax,
  dataTypes,
  identityColumns,
  constraint,
  schemaNamespace,
  // intermediate
  advancedQuery,
  indexModule,
  transaction,
  viewFunction,
  jsonb,
  fullTextSearch,
  permission,
  advancedTypes,
  // advanced
  performance,
  vacuum,
  monitoring,
  architecture,
  configTuning,
  replication,
  partitionSharding,
  backupRestore,
  extensions,
];

export const modules = new Map<string, ModuleDef>(all.map((m) => [m.slug, m]));

export function listModules() {
  return all
    .slice()
    .sort((a, b) => a.group.localeCompare(b.group) || a.order - b.order)
    .map((m) => ({
      slug: m.slug,
      group: m.group,
      title: m.title,
      order: m.order,
    }));
}

export function getModule(slug: string): ModuleDef | undefined {
  return modules.get(slug);
}
