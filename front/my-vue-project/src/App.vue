<template>
  <header class="sticky">
    <nav class="navbar">
      <RouterLink :to="{ name: 'home' }" class="logo-link">
        <img src="@/assets/ssafyLogo.png" alt="로고" class="logo-img" />
      </RouterLink>
      <div class="nav-links">
        <RouterLink :to="{ name: 'MovieList' }" class="nav-item">영화조회</RouterLink>
        <RouterLink :to="{ name: 'ReviewSearch' }" class="nav-item">리뷰검색</RouterLink>
        <RouterLink :to="{ name: 'Recommended' }" class="nav-item">영화추천</RouterLink>
        <RouterLink :to="{ name: 'signup' }" class="nav-item" v-show="!store.isLogin">회원가입</RouterLink>
        <RouterLink :to="{ name: 'login' }" class="nav-item" v-show="!store.isLogin">로그인</RouterLink>
        <RouterLink :to="{ name: 'profile' }" v-show="store.isLogin">프로필</RouterLink>
        <a href="#" @click="onLogout" v-show="store.isLogin">로그아웃</a>
      </div>
    </nav>
  </header>
  <RouterView />
</template>

<script setup>
import { RouterLink, RouterView } from 'vue-router'
import { useUserStore } from '@/stores/auth.js'
import { useRouter } from 'vue-router'

const store=useUserStore()
const router = useRouter()

const onLogout=function(){
  store.logout()
  window.alert('로그아웃되었습니다.')
  router.push({name:'home'})
}

</script>

<style scoped>
/* ===== 전역 기본 스타일 ===== */
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

/* ===== 내브바 ===== */
.navbar {
  background-color: #000000;
  color: white;
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 0.5rem 1.5rem;
  height: 60px;
}

.logo-link {
  display: flex;
  align-items: center;
  height: 100%;
}

.logo-img {
  height: 100%;
  max-height: 50px;
  object-fit: contain;
}

/* ===== 내브바 오른쪽 링크들 ===== */
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
  color: #00bcd4; /* 민트 강조 */
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

/* ===== 버튼 ===== */
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

/* ===== 모달 ===== */
.modal-backdrop {
  position: fixed;
  top: 0; left: 0;
  width: 100vw;
  height: 100vh;
  background: rgba(0,0,0,0.5);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 999;
}

.modal-content {
  background: #1f1f1f;
  color: white;
  border-radius: 10px;
  box-shadow: 0 4px 16px rgba(0,0,0,0.5);
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

.sticky {
  position: sticky;
  top: 0px;
  z-index: 9999;
}

</style>
