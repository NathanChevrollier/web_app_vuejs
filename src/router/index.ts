import { createRouter, createWebHistory } from 'vue-router'
import PostList from '@/components/PostList.vue'
import MultiStepForm from '@/components/MultiStepForm.vue'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'home',
      component: () => import('@/views/HomeView.vue'),
    },
    {
      path: '/form',
      name: 'form',
      component: MultiStepForm,
    },
    {
      path: '/posts',
      name: 'posts',
      component: PostList,
    },
    {
      path: '/resources',
      name: 'resources',
      component: () => import('@/views/ResourcesView.vue'),
    },
  ],
})

export default router
