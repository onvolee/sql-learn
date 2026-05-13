import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import type { ModuleDef } from '../../types.ts';
import equivOfConninfo from './examples/equiv-of-conninfo.ts';
import equivOfL from './examples/equiv-of-l.ts';
import equivOfDt from './examples/equiv-of-dt.ts';
import equivOfDTable from './examples/equiv-of-d-table.ts';
import equivOfDi from './examples/equiv-of-di.ts';
import equivOfDf from './examples/equiv-of-df.ts';
import equivOfDu from './examples/equiv-of-du.ts';

const here = path.dirname(fileURLToPath(import.meta.url));

const module: ModuleDef = {
  slug: 'psql-commands',
  group: 'basic',
  title: 'psql 命令',
  order: 3,
  markdown: () => fs.readFileSync(path.join(here, 'index.md'), 'utf8'),
  seedSql: () => fs.readFileSync(path.join(here, 'seed.sql'), 'utf8'),
  examples: [
    equivOfConninfo,
    equivOfL,
    equivOfDt,
    equivOfDTable,
    equivOfDi,
    equivOfDf,
    equivOfDu,
  ],
};

export default module;
