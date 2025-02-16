import { createRouter, createWebHistory } from 'vue-router'
import HomeView from '../views/HomeView.vue'
import ContactView from '@/views/ContactView.vue'
import ProjectView from '@/views/ProjectView.vue'
import SplashScreen from "@/views/SplashScreen.vue";
// import SkillsView from '@/views/SkillsView.vue';


const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: "/splash",
      name: "SplashScreen",
      component: SplashScreen,
    },
    {
      path: '/',
      name: 'me',
      component: HomeView,
    },
    {
      path: '/projects',
      name: 'project',
      component: ProjectView,
    },
    // {
    //   path: '/skills',
    //   name: 'skills',
    //   component: SkillsView,
    // },
    {
      path: '/contact',
      name: 'contact',
      component: ContactView,
    },
    
    // {
    //   path: '/about',
    //   name: 'about',
    //   // route level code-splitting
    //   // this generates a separate chunk (About.[hash].js) for this route
    //   // which is lazy-loaded when the route is visited.
    //   component: () => import('../views/AboutView.vue'),
    // },
  ],

  scrollBehavior(to, from, savedPosition) {
    if (savedPosition) {
      return savedPosition; // Garde la position précédente si l'utilisateur revient en arrière
    } else {
      return { top: 0, behavior: "smooth" }; // Scroll fluide vers le haut
    }
  },
})

export default router
