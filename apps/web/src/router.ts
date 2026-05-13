import { createRouter, createWebHistory } from 'vue-router';
import HomeView from './views/HomeView.vue';
import ModuleView from './views/ModuleView.vue';

export const router = createRouter({
  history: createWebHistory(),
  routes: [
    { path: '/', name: 'home', component: HomeView },
    { path: '/m/:slug', name: 'module', component: ModuleView, props: true },
  ],
});
