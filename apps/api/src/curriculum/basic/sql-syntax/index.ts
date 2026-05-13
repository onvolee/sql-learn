import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import type { ModuleDef } from '../../types.ts';
import ddlCreateTable from './examples/ddl-create-table.ts';
import ddlAlterAddColumn from './examples/ddl-alter-add-column.ts';
import ddlAlterRenameColumn from './examples/ddl-alter-rename-column.ts';
import ddlDropTable from './examples/ddl-drop-table.ts';
import dmlInsertMin from './examples/dml-insert-min.ts';
import dmlUpdateMin from './examples/dml-update-min.ts';
import dmlDeleteMin from './examples/dml-delete-min.ts';
import dqlGroupHaving from './examples/dql-group-having.ts';
import dqlOrderLimit from './examples/dql-order-limit.ts';
import dclCreateRole from './examples/dcl-create-role.ts';
import dclGrantSelect from './examples/dcl-grant-select.ts';
import dclInspectGrants from './examples/dcl-inspect-grants.ts';
import dclRevokeSelect from './examples/dcl-revoke-select.ts';

const here = path.dirname(fileURLToPath(import.meta.url));

const module: ModuleDef = {
  slug: 'sql-syntax',
  group: 'basic',
  title: 'SQL 基础语法',
  order: 4,
  markdown: () => fs.readFileSync(path.join(here, 'index.md'), 'utf8'),
  seedSql: () => fs.readFileSync(path.join(here, 'seed.sql'), 'utf8'),
  examples: [
    ddlCreateTable,
    ddlAlterAddColumn,
    ddlAlterRenameColumn,
    ddlDropTable,
    dmlInsertMin,
    dmlUpdateMin,
    dmlDeleteMin,
    dqlGroupHaving,
    dqlOrderLimit,
    dclCreateRole,
    dclGrantSelect,
    dclInspectGrants,
    dclRevokeSelect,
  ],
};

export default module;
