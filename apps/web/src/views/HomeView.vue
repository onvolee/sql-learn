<script setup lang="ts"></script>

<template>
  <div style="max-width: 720px;">
    <h1>SQL Learn</h1>
    <p>本地交互式 PostgreSQL 学习站。</p>
    <ul>
      <li>左侧菜单按 <em>入门 / 进阶 / 高级</em> 列出模块，点进去就是一节课。</li>
      <li>每节课正文里嵌入若干「示例」——左 drizzle-orm、右纯 SQL，右下角"运行"会真实命中本地 Docker PostgreSQL。</li>
      <li>每个模块有独立 schema，玩坏了点页面右上角"重置本模块"。</li>
    </ul>
    <p>当前 walking skeleton 只接入了一个模块「CRUD 基础」，验证后再铺其余 24 个。</p>
  </div>
</template>
