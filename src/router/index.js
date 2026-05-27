import { createRouter, createWebHistory } from 'vue-router'

const HomeView = () => import('@/views/HomeView.vue')
const ProjectView = () => import('@/views/ProjectView.vue')
const SkillsView = () => import('@/views/SkillsView.vue')
const TimelineView = () => import('@/views/TimelineView.vue')
const ContactView = () => import('@/views/ContactView.vue')
const PlaygroundView = () => import('@/views/PlaygroundView.vue')

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    // French (default) routes
    { path: '/', name: 'me', component: HomeView, meta: { locale: 'fr' } },
    { path: '/projects', name: 'project', component: ProjectView, meta: { locale: 'fr' } },
    { path: '/projects/:slug', name: 'project-detail', component: ProjectView, meta: { locale: 'fr' } },
    { path: '/skills', name: 'skills', component: SkillsView, meta: { locale: 'fr' } },
    { path: '/timeline', name: 'timeline', component: TimelineView, meta: { locale: 'fr' } },
    { path: '/contact', name: 'contact', component: ContactView, meta: { locale: 'fr' } },
    { path: '/playground', name: 'playground', component: PlaygroundView, meta: { locale: 'fr' } },

    // English routes (same components, locale meta drives i18n switch)
    { path: '/en', name: 'me-en', component: HomeView, meta: { locale: 'en' } },
    { path: '/en/projects', name: 'project-en', component: ProjectView, meta: { locale: 'en' } },
    { path: '/en/projects/:slug', name: 'project-detail-en', component: ProjectView, meta: { locale: 'en' } },
    { path: '/en/skills', name: 'skills-en', component: SkillsView, meta: { locale: 'en' } },
    { path: '/en/timeline', name: 'timeline-en', component: TimelineView, meta: { locale: 'en' } },
    { path: '/en/contact', name: 'contact-en', component: ContactView, meta: { locale: 'en' } },
    { path: '/en/playground', name: 'playground-en', component: PlaygroundView, meta: { locale: 'en' } },

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
