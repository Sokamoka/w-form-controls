import Vue from 'vue';
import VueRouter from 'vue-router';

Vue.use(VueRouter);

const routes = [
  { path: '/', component: () => import('../pages/Form.vue') },
  { path: '/inputs', component: () => import('../pages/Inputs.vue') },
  { path: '/date-pickers', component: () => import('../pages/DatePickers.vue') },
  { path: '/selection', component: () => import('../pages/Selection.vue') },
];

const router = new VueRouter({
  mode: 'history',
  routes,
});

export default router;
