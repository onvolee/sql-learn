<script setup lang="ts">
import { ref, computed } from 'vue';
import { api, type ExampleData, type ExecOk, type ExecErr } from '../api';
import { highlightCode } from '../markdown';

const props = defineProps<{
  moduleSlug: string;
  example: ExampleData;
}>();

const result = ref<ExecOk | null>(null);
const error = ref<string | null>(null);
const running = ref(false);
const lastDurationMs = ref<number | null>(null);

const sqlHtml = computed(() => highlightCode(props.example.display.sql, 'sql'));
const drizzleHtml = computed(() => highlightCode(props.example.display.drizzle, 'typescript'));

const supportBadge = computed(() => {
  switch (props.example.support) {
    case 'partial':
      return { text: 'drizzle 不直接支持 — 用 sql 模板', type: 'warning' as const };
    case 'none':
      return { text: 'drizzle 不涉及该主题', type: 'info' as const };
    default:
      return null;
  }
});

const tableColumns = computed(() => result.value?.columns ?? []);

function fmtCell(_row: unknown, _column: unknown, value: unknown): string {
  return value === null ? 'NULL' : String(value);
}

async function run() {
  running.value = true;
  error.value = null;
  result.value = null;
  try {
    const data = await api.exec(props.moduleSlug, props.example.id);
    lastDurationMs.value = data.durationMs;
    if ('error' in data) {
      error.value = (data as ExecErr).error;
    } else {
      result.value = data as ExecOk;
    }
  } catch (e) {
    error.value = (e as Error).message;
  } finally {
    running.value = false;
  }
}
</script>

<template>
  <el-card class="example-card" shadow="never">
    <template #header>
      <div style="display: flex; justify-content: space-between; align-items: center;">
        <strong>{{ example.title }}</strong>
        <el-tag v-if="supportBadge" :type="supportBadge.type" size="small">
          {{ supportBadge.text }}
        </el-tag>
      </div>
    </template>

    <div class="example-panes">
      <div class="example-pane">
        <div class="example-pane-label">drizzle-orm</div>
        <div v-if="example.support === 'none'" class="example-pane-placeholder">
          该主题 drizzle 不直接涉及，底层走 <code>sql\`...\`</code> 模板执行。
        </div>
        <pre v-else class="hljs"><code class="hljs language-typescript" v-html="drizzleHtml"></code></pre>
      </div>
      <div class="example-pane">
        <div class="example-pane-label">SQL</div>
        <pre class="hljs"><code class="hljs language-sql" v-html="sqlHtml"></code></pre>
      </div>
    </div>

    <div class="example-toolbar">
      <span class="example-duration" v-if="lastDurationMs !== null">耗时 {{ lastDurationMs }} ms</span>
      <el-button
        type="primary"
        :loading="running"
        :disabled="!example.runnable"
        @click="run"
      >
        运行
      </el-button>
    </div>

    <div class="example-result">
      <el-alert
        v-if="error"
        :title="error"
        type="error"
        :closable="false"
        show-icon
        style="margin-bottom: 8px;"
      />
      <el-table
        v-if="result && result.rows.length > 0"
        :data="result.rows"
        size="small"
        border
        stripe
      >
        <el-table-column
          v-for="col in tableColumns"
          :key="col"
          :prop="col"
          :label="col"
          :formatter="fmtCell"
        />
      </el-table>
      <el-empty
        v-else-if="result"
        :description="`返回 ${result.rowCount} 行`"
        :image-size="40"
      />
    </div>
  </el-card>
</template>
