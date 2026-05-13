# 学习postgresql知识体系

我想要系统性学习postgresql数据相关知识。

每个菜单路由模块都有对应代码+文字讲解，代码最好是对接单独数据库 or 同一个数据库不同的表进行直观展示（例如：用户点击则数据库新增，查询数据库则真实查询）=> 每个菜单模块都创建一个pg数据库成本或者每个菜单都对接同一个数据库但操作不同数据库表，需评估可行性和性能问题。

参考 ./postgresql-study-outline.md 学习大纲文件。每个菜单路由就是对应学习大纲的一个节点。

# project stack

使用 vue3 + vite + typescript + element-plus + vue-router + pinia + drizzle-orm 启动一个初始化页面.

页面布局：
左侧菜单目录：放菜单目录使用（el-menu）
右侧是main内容区域: 基于左侧激活的菜单显示对应路由模块

```project structure
- src
  - views
    - basic
      - postgresql-base-field.vue
      - postgresql-base-curd.vue
      - postgresql-base-relations.vue
      - ...// TODO
  - components
  - utils
  - lib
  - App.vue
  - main.ts
- index.html
```

---
