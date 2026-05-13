<script setup lang="ts">
import AppMenu from './components/AppMenu.vue';
</script>

<template>
  <el-container style="height: 100vh;">
    <el-aside width="240px" style="border-right: 1px solid #ebeef5; overflow: auto;">
      <div style="padding: 16px; font-weight: 600; border-bottom: 1px solid #ebeef5;">
        <router-link to="/" style="text-decoration: none; color: inherit;">SQL Learn</router-link>
      </div>
      <AppMenu />
    </el-aside>
    <el-main style="overflow: auto;">
      <router-view />
    </el-main>
  </el-container>
</template>
