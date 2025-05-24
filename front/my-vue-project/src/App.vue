<template>
  <header class="sticky">
    <nav class="navbar">
      <!-- 개선된 HOME 버튼 -->
      <RouterLink :to="{ name: 'home' }" class="home-button">
        <i class="fas fa-home"></i>
        <span>HOME</span>
      </RouterLink>

      <!-- 네비게이션 링크들 -->
      <div class="nav-links">
        <RouterLink :to="{ name: 'MovieList' }" class="nav-item">영화조회</RouterLink>
        <RouterLink :to="{ name: 'ReviewSearch' }" class="nav-item">리뷰검색</RouterLink>
        <RouterLink :to="{ name: 'Recommended' }" class="nav-item">영화추천</RouterLink>
        <RouterLink :to="{ name: 'signup' }" class="nav-item" v-show="!store.isLogin">회원가입</RouterLink>
        <RouterLink :to="{ name: 'login' }" class="nav-item" v-show="!store.isLogin">로그인</RouterLink>
        <RouterLink :to="{ name: 'profile' }" class="nav-item" v-show="store.isLogin">프로필</RouterLink>
        <a href="#" @click="onLogout" class="nav-item" v-show="store.isLogin">로그아웃</a>
      </div>
    </nav>
  </header>

  <RouterView />
</template>

<script setup>
import { RouterLink, RouterView } from 'vue-router'
import { useUserStore } from '@/stores/auth.js'
import { useRouter } from 'vue-router'
import '@fortawesome/fontawesome-free/css/all.css'

const store = useUserStore()
const router = useRouter()

const onLogout = () => {
  store.logout()
  alert('로그아웃되었습니다.')
  router.push({ name: 'home' })
}
</script>

<style scoped>
/* ===== 전체 레이아웃 ===== */
body {
  margin: 0;
  padding: 0;
  background-color: #121212;
  color: #ffffff;
  font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
}

a {
  text-decoration: none;
  color: inherit;
}

/* ===== 상단 고정 ===== */
.sticky {
  position: sticky;
  top: 0;
  z-index: 9999;
}

/* ===== 네비게이션 바 ===== */
.navbar {
  background-color: #000000;
  color: white;
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 0.5rem 1.5rem;
  height: 60px;
}

/* ===== HOME 버튼 (리디자인) ===== */
.home-button {
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 6px 14px;
  background-color: #00bcd4;
  color: #ffffff;
  border-radius: 30px;
  font-weight: bold;
  font-size: 1rem;
  transition: background-color 0.3s ease, transform 0.2s ease;
}

.home-button:hover {
  background-color: #0097a7;
  transform: translateY(-2px);
}

.home-button i {
  font-size: 1.1rem;
}

/* ===== 네비게이션 링크 ===== */
.nav-links {
  display: flex;
  gap: 1.5rem;
  align-items: center;
}

.nav-item {
  color: white;
  text-decoration: none;
  font-weight: bold;
  transition: color 0.3s ease;
}

.nav-item:hover {
  color: #00bcd4;
}

/* ===== 버튼 공통 스타일 ===== */
button {
  background-color: #00bcd4;
  color: #fff;
  border: none;
  padding: 0.5rem 1rem;
  border-radius: 8px;
  cursor: pointer;
  font-weight: bold;
  transition: background-color 0.2s ease;
}

button:hover {
  background-color: #0097a7;
}

/* ===== 카드 ===== */
.card {
  background-color: #1e1e1e;
  color: white;
  border-radius: 12px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.4);
  transition: transform 0.2s ease, box-shadow 0.2s ease;
}

.card:hover {
  transform: translateY(-5px);
  box-shadow: 0 8px 16px rgba(0, 255, 255, 0.2);
}

.card-title {
  font-size: 1.2rem;
  margin-bottom: 0.5rem;
}

.card-text {
  font-size: 0.95rem;
  color: #cccccc;
}

/* ===== 모달 ===== */
.modal-backdrop {
  position: fixed;
  top: 0;
  left: 0;
  width: 100vw;
  height: 100vh;
  background: rgba(0, 0, 0, 0.5);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 999;
}

.modal-content {
  background: #1f1f1f;
  color: white;
  border-radius: 10px;
  box-shadow: 0 4px 16px rgba(0, 0, 0, 0.5);
  width: 750px;
  overflow: hidden;
  display: flex;
  flex-direction: column;
}

.modal-header {
  padding: 0.75rem 1rem;
  display: flex;
  justify-content: space-between;
  align-items: center;
  font-weight: bold;
  border-bottom: 1px solid #444;
}

.close-btn {
  background: transparent;
  border: none;
  color: #bbb;
  font-size: 1.25rem;
  cursor: pointer;
}

.close-btn:hover {
  color: #fff;
}

iframe {
  width: 100%;
  height: 390px;
  border: none;
  display: block;
}
</style>
