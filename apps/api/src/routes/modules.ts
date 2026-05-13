import { Hono } from 'hono';
import { sql } from 'drizzle-orm';
import { db } from '../db.ts';
import { listModules, getModule } from '../curriculum/registry.ts';

const DEFAULT_TIMEOUT_MS = 5000;

function schemaName(slug: string) {
  return `m_${slug.replace(/-/g, '_')}`;
}

type PgResultLike = {
  command: string;
  rowCount: number | null;
  rows: unknown[];
  fields?: { name: string }[];
};

function isPgResult(x: unknown): x is PgResultLike {
  return (
    !!x &&
    typeof x === 'object' &&
    'command' in x &&
    'rows' in x &&
    Array.isArray((x as { rows: unknown }).rows)
  );
}

function normalizeResult(result: unknown): { columns: string[]; rows: unknown[]; rowCount: number } {
  // 多语句 SQL：pg 返回 Result[]，每条语句一个 Result。
  // 取最后一条带 rows 的（通常是结尾的 SELECT），用它的 fields/rows 渲染。
  if (Array.isArray(result) && result.length > 0 && result.every(isPgResult)) {
    const withRows = [...result].reverse().find((r) => r.rows.length > 0);
    const pick = withRows ?? result[result.length - 1];
    const rows = pick.rows as Record<string, unknown>[];
    const columns =
      pick.fields?.map((f) => f.name) ?? (rows.length ? Object.keys(rows[0]) : []);
    return { columns, rows, rowCount: rows.length };
  }
  if (Array.isArray(result)) {
    const rows = result as Record<string, unknown>[];
    const columns = rows.length ? Object.keys(rows[0]) : [];
    return { columns, rows, rowCount: rows.length };
  }
  const qr = result as { fields?: { name: string }[]; rows?: unknown[]; rowCount?: number | null };
  const rows = qr.rows ?? [];
  const columns =
    qr.fields?.map((f) => f.name) ?? (rows.length ? Object.keys(rows[0] as object) : []);
  return { columns, rows, rowCount: qr.rowCount ?? rows.length };
}

export const modulesRouter = new Hono();

modulesRouter.get('/', (c) => c.json({ modules: listModules() }));

modulesRouter.get('/:slug', (c) => {
  const slug = c.req.param('slug');
  const m = getModule(slug);
  if (!m) return c.json({ error: 'unknown module' }, 404);
  return c.json({
    slug: m.slug,
    group: m.group,
    title: m.title,
    order: m.order,
    markdown: m.markdown(),
    examples: m.examples.map((ex) => ({
      id: ex.id,
      title: ex.title,
      support: ex.support,
      display: ex.display,
      runnable: typeof ex.execute === 'function',
    })),
  });
});

modulesRouter.post('/:slug/ensure', async (c) => {
  const slug = c.req.param('slug');
  const m = getModule(slug);
  if (!m) return c.json({ error: 'unknown module' }, 404);

  const schema = schemaName(slug);
  const { rows } = await db.execute(
    sql`SELECT 1 FROM pg_namespace WHERE nspname = ${schema}`,
  );
  if (rows.length > 0) return c.json({ schema, status: 'exists' });

  const seedSql = m.seedSql();
  await db.transaction(async (tx) => {
    await tx.execute(sql.raw(`CREATE SCHEMA "${schema}" AUTHORIZATION app`));
    if (seedSql.trim()) {
      await tx.execute(sql.raw(`SET LOCAL search_path = "${schema}", pg_catalog`));
      await tx.execute(sql.raw(seedSql));
    }
  });
  return c.json({ schema, status: 'created' });
});

modulesRouter.post('/:slug/reset', async (c) => {
  const slug = c.req.param('slug');
  const m = getModule(slug);
  if (!m) return c.json({ error: 'unknown module' }, 404);

  const schema = schemaName(slug);
  const seedSql = m.seedSql();
  await db.transaction(async (tx) => {
    await tx.execute(sql.raw(`DROP SCHEMA IF EXISTS "${schema}" CASCADE`));
    await tx.execute(sql.raw(`CREATE SCHEMA "${schema}" AUTHORIZATION app`));
    if (seedSql.trim()) {
      await tx.execute(sql.raw(`SET LOCAL search_path = "${schema}", pg_catalog`));
      await tx.execute(sql.raw(seedSql));
    }
  });
  return c.json({ schema, status: 'reset' });
});

modulesRouter.post('/:slug/exec', async (c) => {
  const slug = c.req.param('slug');
  const m = getModule(slug);
  if (!m) return c.json({ error: 'unknown module' }, 404);

  const body = await c.req.json().catch(() => ({}));
  const exampleId = body?.exampleId as string | undefined;
  if (!exampleId) return c.json({ error: 'exampleId required' }, 400);

  const example = m.examples.find((e) => e.id === exampleId);
  if (!example) return c.json({ error: 'unknown example' }, 404);
  if (!example.execute) return c.json({ error: 'example not runnable' }, 400);

  const schema = schemaName(slug);
  const timeoutMs = example.timeoutMs ?? DEFAULT_TIMEOUT_MS;

  const t0 = Date.now();
  try {
    const result = await db.transaction(async (tx) => {
      await tx.execute(sql.raw(`SET LOCAL search_path = "${schema}", pg_catalog`));
      await tx.execute(sql.raw(`SET LOCAL statement_timeout = ${timeoutMs}`));
      return await example.execute!(tx as unknown as typeof db);
    });
    const normalized = normalizeResult(result);
    return c.json({
      ...normalized,
      durationMs: Date.now() - t0,
    });
  } catch (e) {
    const err = e as Error;
    return c.json(
      {
        error: err.message ?? String(err),
        durationMs: Date.now() - t0,
      },
      400,
    );
  }
});
