import MarkdownIt from 'markdown-it';
import hljs from 'highlight.js';
import { renderMermaidSVG } from 'beautiful-mermaid';

function escapeHtml(s: string): string {
  return s.replace(/[&<>"']/g, (c) =>
    c === '&' ? '&amp;' : c === '<' ? '&lt;' : c === '>' ? '&gt;' : c === '"' ? '&quot;' : '&#39;',
  );
}

const md = new MarkdownIt({
  html: false,
  linkify: true,
  typographer: false,
  highlight(str: string, lang: string): string {
    if (lang && hljs.getLanguage(lang)) {
      try {
        return `<pre class="hljs"><code class="hljs language-${lang}">${
          hljs.highlight(str, { language: lang, ignoreIllegals: true }).value
        }</code></pre>`;
      } catch { /* fallthrough to escape */ }
    }
    return `<pre class="hljs"><code class="hljs">${escapeHtml(str)}</code></pre>`;
  },
});

// Override fence renderer for mermaid. markdown-it default fence wraps the
// highlight() return in <pre><code> unless it already starts with "<pre",
// which would re-escape our SVG. So we intercept before highlight() runs.
const defaultFence = md.renderer.rules.fence!;
md.renderer.rules.fence = (tokens, idx, options, env, slf) => {
  const token = tokens[idx];
  const info = token.info ? token.info.trim() : '';
  const lang = info.split(/\s+/g)[0];
  if (lang === 'mermaid') {
    try {
      const svg = renderMermaidSVG(token.content, {
        bg: 'var(--mermaid-bg, transparent)',
        fg: 'var(--mermaid-fg, #27272A)',
        transparent: true,
      });
      return `<div class="mermaid-block">${svg}</div>\n`;
    } catch (e) {
      return `<pre class="mermaid-error">${escapeHtml(String(e))}\n\n${escapeHtml(token.content)}</pre>\n`;
    }
  }
  return defaultFence(tokens, idx, options, env, slf);
};

export type MarkdownSegment =
  | { kind: 'html'; html: string }
  | { kind: 'example'; id: string };

const EXAMPLE_RE = /^:::example\{id="([^"]+)"\}\s*$/gm;

export function parseMarkdown(source: string): MarkdownSegment[] {
  const segments: MarkdownSegment[] = [];
  EXAMPLE_RE.lastIndex = 0;
  let lastIndex = 0;
  let match: RegExpExecArray | null;
  while ((match = EXAMPLE_RE.exec(source)) !== null) {
    const before = source.slice(lastIndex, match.index);
    if (before.trim()) segments.push({ kind: 'html', html: md.render(before) });
    segments.push({ kind: 'example', id: match[1] });
    lastIndex = match.index + match[0].length;
  }
  const after = source.slice(lastIndex);
  if (after.trim()) segments.push({ kind: 'html', html: md.render(after) });
  return segments;
}

export function highlightCode(code: string, lang: 'sql' | 'typescript' | 'javascript'): string {
  try {
    return hljs.highlight(code, { language: lang, ignoreIllegals: true }).value;
  } catch {
    return escapeHtml(code);
  }
}
