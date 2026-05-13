<script setup lang="ts">
import { ref, computed, watch } from 'vue';
import { ElMessage } from 'element-plus';
import { api, type ModuleData } from '../api';
import { parseMarkdown, type MarkdownSegment } from '../markdown';
import CodeExample from '../components/CodeExample.vue';

const props = defineProps<{ slug: string }>();

const module = ref<ModuleData | null>(null);
const segments = ref<MarkdownSegment[]>([]);
const loading = ref(false);
const loadError = ref<string | null>(null);
const resetting = ref(false);

const examplesById = computed(() => {
  const map: Record<string, ModuleData['examples'][number]> = {};
  module.value?.examples.forEach((ex) => { map[ex.id] = ex; });
  return map;
});

async function load() {
  loading.value = true;
  loadError.value = null;
  module.value = null;
  segments.value = [];
  try {
    await api.ensure(props.slug);
    const data = await api.getModule(props.slug);
    module.value = data;
    segments.value = parseMarkdown(data.markdown);
  } catch (e) {
    loadError.value = (e as Error).message;
  } finally {
    loading.value = false;
  }
}

async function doReset() {
  resetting.value = true;
  try {
    await api.reset(props.slug);
    ElMessage.success('已重置');
    await load();
  } catch (e) {
    ElMessage.error((e as Error).message);
  } finally {
    resetting.value = false;
  }
}

watch(() => props.slug, load, { immediate: true });
</script>

<template>
  <div v-loading="loading">
    <div v-if="loadError">
      <el-alert :title="loadError" type="error" :closable="false" show-icon />
    </div>

    <template v-else-if="module">
      <div style="display: flex; justify-content: flex-end; margin-bottom: 8px;">
        <el-popconfirm
          title="确定重置本模块？所有改动会丢失。"
          confirm-button-text="重置"
          cancel-button-text="取消"
          @confirm="doReset"
        >
          <template #reference>
            <el-button :loading="resetting" type="warning" plain size="small">
              重置本模块
            </el-button>
          </template>
        </el-popconfirm>
      </div>

      <div class="module-md">
        <template v-for="(seg, i) in segments" :key="i">
          <div v-if="seg.kind === 'html'" v-html="seg.html" />
          <CodeExample
            v-else-if="examplesById[seg.id]"
            :module-slug="slug"
            :example="examplesById[seg.id]"
          />
          <el-alert
            v-else
            :title="`示例缺失：${seg.id}`"
            type="error"
            :closable="false"
            show-icon
          />
        </template>
      </div>
    </template>
  </div>
</template>
