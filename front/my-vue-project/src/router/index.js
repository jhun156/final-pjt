import { createRouter, createWebHistory } from 'vue-router'
import {useUserStore} from '@/stores/auth.js'

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
      component: () => import('@/views/MovieListView.vue'),
    },
    {
      path: '/review-search',
      name: 'ReviewSearch',
      component: () => import('@/views/ReviewSearchView.vue')
    },
    {
      path: '/movies/:movieId',
      name: 'MovieDetail',
      component: () => import('@/views/MovieDetailView.vue')
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
    },
    {
      path: '/otherprofile/:userid/',
      name: 'otherprofile',
      component: () => import('@/views/OtherProfileView.vue')
    },
    {
      path: '/update',
      name: 'update',
      component: () => import('@/views/updateProfile.vue')
    },
    {
      path: '/secret',
      name: 'secret',
      component: () => import('@/views/SecretView.vue')
    }
  ],
})

export default router

router.beforeEach((to, from) => {
  const store = useUserStore();

  const publicPages = ['home', 'login', 'signup'];

  if (!store.isLogin && !publicPages.includes(to.name)) {
    if (from.name === 'update') {
      return { name: 'login' };
    }

    window.alert('로그인이 필요합니다');
    return { name: 'login' };
  }
});
