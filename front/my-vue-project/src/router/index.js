import { createRouter, createWebHistory } from 'vue-router'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'home',
      component: () => import('@/views/HomeView.vue')
    },
    {
      path: '/movies',
      name: 'MovieList',
      component: () => import('@/views/MovieListView.vue')
    },
    {
      path: '/:movieId',
      name: 'MovieDetail',
      component: () => import('@/views/MovieDetailView.vue')
    },
    {
      path: '/review-search',
      name: 'ReviewSearch',
      component: () => import('@/views/ReviewSearchView.vue')
    },
    {
      path: '/recommended',
      name: 'Recommended',
      component: () => import('@/views/RecommendedView.vue')
    },
    {
      path: '/login',
      name: 'login',
      component: () => import('@/views/LoginView.vue')
    },
    {
      path: '/signup',
      name: 'signup',
      component: () => import('@/views/SignUpView.vue')
    },
    {
      path: '/profile',
      name: 'profile',
      component: () => import('@/views/ProfileView.vue')
    }
  ],
})

export default router

router.beforeEach((to,from)=>{
  
})