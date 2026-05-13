<script setup lang="ts">
import { onMounted, ref, computed } from 'vue';
import { useRoute } from 'vue-router';
import { api, type ModuleListItem } from '../api';

const route = useRoute();
const modules = ref<ModuleListItem[]>([]);
const error = ref<string | null>(null);

const grouped = computed(() => {
  const order: ModuleListItem['group'][] = ['basic', 'intermediate', 'advanced', 'drizzle'];
  const labels: Record<ModuleListItem['group'], string> = {
    basic: '入门',
    intermediate: '进阶',
    advanced: '高级',
    drizzle: 'drizzle',
  };
  return order
    .map((g) => ({
      group: g,
      label: labels[g],
      items: modules.value.filter((m) => m.group === g).sort((a, b) => a.order - b.order),
    }))
    .filter((g) => g.items.length > 0);
});

const activeIndex = computed(() => (route.params.slug as string | undefined) ?? '');

onMounted(async () => {
  try {
    const data = await api.listModules();
    modules.value = data.modules;
  } catch (e) {
    error.value = (e as Error).message;
  }
});
</script>

<template>
  <el-menu :default-active="activeIndex" router>
    <template v-for="g in grouped" :key="g.group">
      <el-sub-menu :index="g.group">
        <template #title>{{ g.label }}</template>
        <el-menu-item
          v-for="m in g.items"
          :key="m.slug"
          :index="m.slug"
          :route="{ name: 'module', params: { slug: m.slug } }"
        >
          {{ m.title }}
        </el-menu-item>
      </el-sub-menu>
    </template>
    <el-alert v-if="error" :title="error" type="error" :closable="false" show-icon />
  </el-menu>
</template>
