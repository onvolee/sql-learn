import type { DB } from '../db.ts';

export type SupportTier = 'full' | 'partial' | 'none';

export interface ExampleDef {
  id: string;
  title: string;
  support: SupportTier;
  display: {
    sql: string;
    drizzle: string;
  };
  /** drizzle-orm 不涉及该主题时 (`support: 'none'`)，execute 可以省略 — UI 会禁用"运行"按钮。 */
  execute?: (db: DB) => Promise<unknown>;
  /** 单 example 的语句超时覆盖默认值。 */
  timeoutMs?: number;
}

export interface ModuleDef {
  slug: string;
  group: 'basic' | 'intermediate' | 'advanced' | 'drizzle';
  title: string;
  order: number;
  /** Thunk — 读盘延迟到调用时，dev 改 .md 无需重启 tsx watch。 */
  markdown: () => string;
  /** Thunk — 同 markdown，让 ensure/reset 永远拿到最新的 seed.sql。 */
  seedSql: () => string;
  examples: ExampleDef[];
}
