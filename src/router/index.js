import { createRouter, createWebHistory } from 'vue-router';
import { APP_ROUTES } from '@/constants';

const routes = [
  {
    path: APP_ROUTES.ROOT.PATH,
    name: APP_ROUTES.ROOT.NAME,
    component: () => import(
      /* webpackChunkName: "page-stocks" */
      '@/views/page-stocks.vue'
    ),
  },
];

const router = createRouter({
  history: createWebHistory(process.env.BASE_URL),
  routes,
});

export default router;
