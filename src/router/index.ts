import { createRouter, createWebHistory } from 'vue-router'

import LiveView from '@/views/LiveView.vue'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'live',
      component: LiveView,
    },
  ],
})

export default router
