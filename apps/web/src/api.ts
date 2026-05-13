export interface ModuleListItem {
  slug: string;
  group: 'basic' | 'intermediate' | 'advanced' | 'drizzle';
  title: string;
  order: number;
}

export interface ExampleData {
  id: string;
  title: string;
  support: 'full' | 'partial' | 'none';
  display: { sql: string; drizzle: string };
  runnable: boolean;
}

export interface ModuleData {
  slug: string;
  group: ModuleListItem['group'];
  title: string;
  order: number;
  markdown: string;
  examples: ExampleData[];
}

export interface ExecOk {
  columns: string[];
  rows: Record<string, unknown>[];
  rowCount: number;
  durationMs: number;
}

export interface ExecErr {
  error: string;
  durationMs: number;
}

async function req<T>(path: string, init?: RequestInit): Promise<T> {
  const res = await fetch(path, {
    ...init,
    headers: { 'content-type': 'application/json', ...(init?.headers ?? {}) },
  });
  if (!res.ok) {
    let msg = res.statusText;
    try {
      const body = await res.json();
      msg = body.error ?? JSON.stringify(body);
    } catch {
      try { msg = await res.text(); } catch { /* keep statusText */ }
    }
    throw new Error(msg);
  }
  return res.json() as Promise<T>;
}

export const api = {
  listModules: () => req<{ modules: ModuleListItem[] }>('/api/modules'),
  getModule: (slug: string) => req<ModuleData>(`/api/modules/${slug}`),
  ensure: (slug: string) =>
    req<{ schema: string; status: 'exists' | 'created' }>(`/api/modules/${slug}/ensure`, { method: 'POST' }),
  reset: (slug: string) =>
    req<{ schema: string; status: 'reset' }>(`/api/modules/${slug}/reset`, { method: 'POST' }),
  exec: (slug: string, exampleId: string) =>
    req<ExecOk | ExecErr>(`/api/modules/${slug}/exec`, {
      method: 'POST',
      body: JSON.stringify({ exampleId }),
    }),
};
