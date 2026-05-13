import { Hono } from 'hono';
import { cors } from 'hono/cors';
import { logger } from 'hono/logger';
import { serve } from '@hono/node-server';
import { modulesRouter } from './routes/modules.ts';

const app = new Hono();

app.use('*', logger());
app.use('*', cors({ origin: ['http://localhost:5173'] }));

app.get('/health', (c) => c.json({ ok: true }));

app.route('/api/modules', modulesRouter);

const port = Number(process.env.PORT ?? 3001);
serve({ fetch: app.fetch, port });
console.log(`api listening on http://localhost:${port}`);
