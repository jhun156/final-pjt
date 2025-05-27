<template>
  <header class="sticky">
    <nav class="navbar">
      <!-- HOME 버튼 -->
      <RouterLink :to="{ name: 'home' }" class="home-button">
        <i class="fas fa-home"></i>
        <span>HOME</span>
      </RouterLink>

      <!-- 햄버거 버튼 -->
      <button class="hamburger" @click="toggleMenu" aria-label="Toggle menu">
        <span :class="{ open: menuOpen }"></span>
        <span :class="{ open: menuOpen }"></span>
        <span :class="{ open: menuOpen }"></span>
      </button>

      <!-- 네비게이션 링크 -->
      <div :class="['nav-links', { open: menuOpen }]">
        <RouterLink :to="{ name: 'MovieList' }" class="nav-item" @click="closeMenu">영화조회</RouterLink>
        <RouterLink :to="{ name: 'ReviewSearch' }" class="nav-item" @click="closeMenu">리뷰검색</RouterLink>
        <RouterLink :to="{ name: 'Recommended' }" class="nav-item" @click="closeMenu">영화추천</RouterLink>
        <RouterLink :to="{ name: 'signup' }" class="nav-item" v-show="!store.isLogin" @click="closeMenu">회원가입</RouterLink>
        <RouterLink :to="{ name: 'login' }" class="nav-item" v-show="!store.isLogin" @click="closeMenu">로그인</RouterLink>
        <RouterLink :to="{ name: 'profile' }" class="nav-item" v-show="store.isLogin" @click="closeMenu">프로필</RouterLink>
        <a href="#" @click.prevent="onLogout" class="nav-item" v-show="store.isLogin">로그아웃</a>
      </div>
    </nav>
  </header>
  <RouterView />
</template>

<script setup>
import { ref } from 'vue'
import { RouterLink, RouterView } from 'vue-router'
import { useUserStore } from '@/stores/auth.js'
import { useRouter } from 'vue-router'
import '@fortawesome/fontawesome-free/css/all.css'

const store = useUserStore()
const router = useRouter()

const menuOpen = ref(false)

const toggleMenu = () => {
  menuOpen.value = !menuOpen.value
}

const closeMenu = () => {
  menuOpen.value = false
}

const onLogout = () => {
  store.logout()
  alert('로그아웃되었습니다.')
  router.push({ name: 'home' })
  closeMenu()
}
</script>

<style scoped>
h1, h2, h3, h4, h5, h6 {
  font-family: 'Cinzel', 'DM Serif Display', serif;
  letter-spacing: 0.5px;
}

html, body {
  margin: 0;
  padding: 0;
  height: 100%;
  width: 100%;
  overflow: visible !important;
}

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

/* ===== HOME 버튼 ===== */
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

/* ===== 햄버거 버튼 기본 숨김 ===== */
.hamburger {
  display: none;
  flex-direction: column;
  justify-content: space-around;
  width: 24px;
  height: 24px;
  background: transparent;
  border: none;
  cursor: pointer;
  padding: 0;
  z-index: 10000;
}

.hamburger span {
  width: 24px;
  height: 3px;
  background: white;
  border-radius: 2px;
  transition: all 0.3s linear;
  position: relative;
  transform-origin: 1px;
}

/* 햄버거 열림 상태 애니메이션 */
.hamburger span.open:nth-child(1) {
  transform: rotate(45deg);
}

.hamburger span.open:nth-child(2) {
  opacity: 0;
  transform: translateX(20px);
}

.hamburger span.open:nth-child(3) {
  transform: rotate(-45deg);
}

/* 작은 화면에서 햄버거 버튼 보이게 */
@media (max-width: 768px) {
  .hamburger {
    display: flex;
  }

  /* 네비게이션 링크 감추기 기본 */
  .nav-links {
    display: none;
    flex-direction: column;
    background-color: #000000;
    position: absolute;
    top: 60px;
    right: 0;
    width: 200px;
    padding: 1rem;
    border-radius: 0 0 0 8px;
    box-shadow: 0 4px 12px rgba(0,0,0,0.5);
  }

  /* 메뉴 열렸을 때 보여줌 */
  .nav-links.open {
    display: flex;
  }

  /* 네비게이션 아이템 세로 정렬, 간격 */
  .nav-item {
    padding: 0.5rem 0;
    font-weight: 600;
  }
}

/* 큰 화면은 기존 flex row 유지 */
@media (min-width: 769px) {
  .nav-links {
    display: flex !important;
    position: static !important;
    flex-direction: row !important;
    width: auto !important;
    padding: 0 !important;
    box-shadow: none !important;
  }
}
</style>
