import { createRouter, createWebHistory } from 'vue-router'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: "/splash",
      name: "SplashScreen",
      component: () => import("@/views/SplashScreen.vue"),
    },
    {
      path: '/',
      name: 'me',
      component: () => import('@/views/HomeView.vue'),
    },
    {
      path: '/projects',
      name: 'project',
      component: () => import('@/views/ProjectView.vue'),
    },
    {
      path: '/skills',
      name: 'skills',
      component: () => import('@/views/SkillsView.vue'),
    },
    {
      path: '/timeline',
      name: 'timeline',
      component: () => import('@/views/TimelineView.vue'),
    },
    {
      path: '/contact',
      name: 'contact',
      component: () => import('@/views/ContactView.vue'),
    },
    {
      path: '/playground',
      name: 'playground',
      component: () => import('@/views/PlaygroundView.vue'),
    },
    {
      path: '/:pathMatch(.*)*',
      name: 'not-found',
      component: () => import('@/views/NotFoundView.vue'),
    },
  ],

  scrollBehavior(to, from, savedPosition) {
    if (savedPosition) {
      return savedPosition;
    } else {
      return { top: 0, behavior: "smooth" };
    }
  },
})

export default router
