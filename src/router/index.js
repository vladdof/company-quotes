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
  {
    path: APP_ROUTES.STOCK.PATH,
    name: APP_ROUTES.STOCK.NAME,
    // which is lazy-loaded when the route is visited.
    component: () => import(
      /* webpackChunkName: "page-stock" */
      '@/views/page-stock.vue'
    ),
    props: true,
  },
];

const router = createRouter({
  history: createWebHistory(process.env.BASE_URL),
  routes,
});

export default router;
