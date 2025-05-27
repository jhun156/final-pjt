<template>
  <div class="home-wrapper">
    <div class="home-container">
      <h1 class="main-title">🎬 <span class="highlight">CineVibe</span>에 오신 걸 환영합니다!</h1>

      <p class="main-description">
        지금 인기 있는 영화들을 살펴보고, 리뷰를 검색하거나<br />
        당신만을 위한 영화를 추천받아보세요!
      </p>

      <RouterLink :to="{ name: 'MovieList' }">
        <button class="home-button">영화 둘러보기</button>
      </RouterLink>

      <div class="info-section">
        <h2 class="info-title">이용 안내</h2>
        <ul class="info-list">
          <li><router-link class="labelrouter" :to="{ name: 'MovieList' }">🎬 영화 조회:</router-link> TMDB 사이트의 데이터를 바탕으로 높은 평점작, 인기 상영작, 현재 상영작, 최신 개봉작을 카테고리별로 볼 수 있습니다.</li>
          <li><router-link class="labelrouter" :to="{ name: 'ReviewSearch' }">🔎 리뷰 검색:</router-link> 영화 제목을 입력하여 해당 영화에 대한 리뷰를 확인할 수 있습니다.</li>
          <li><router-link class="labelrouter" :to="{ name: 'Recommended' }">🌤️ 영화 추천:</router-link> 현재 날씨를 입력하면 날씨에 어울리는 영화 리뷰를 추천해드립니다.</li>
          <li><router-link class="labelrouter" :to="{ name: 'profile' }">👤 프로필:</router-link> 로그인된 사용자의 정보를 확인할 수 있습니다.</li>
        </ul>
      </div>
    </div>

    <!-- 푸터 -->
    <footer class="footer">
      <p>
        <strong>CineVibe</strong>
        <span
          @mousedown="startHold"
          @mouseup="cancelHold"
          @mouseleave="cancelHold"
          style="cursor: pointer; user-select: none; outline: none;"
          class="no-hover"
        >
          ©
        </span>
        2025 | 제작자: 권민환, 박지훈
      </p>
    </footer>
  </div>
</template>

<script setup>
import { RouterLink } from 'vue-router'
import { useProfileStore } from '@/stores/profile.js'
import { onMounted, ref } from 'vue'
import { useRouter } from 'vue-router'

const profileStore = useProfileStore()
const router = useRouter()
const holdTimer = ref(null)

onMounted(() => {
  profileStore.userInfo()
  profileStore.myFollowStatus()
})

const startHold = () => {
  holdTimer.value = setTimeout(() => {
    router.push({ name: 'secret' })
  }, 2000)
}

const cancelHold = () => {
  clearTimeout(holdTimer.value)
}
</script>

<style scoped>
.home-wrapper {
  height: 100vh; /* 화면 전체 꽉 채움 */
  display: flex;
  flex-direction: column;
  overflow: hidden; /* 스크롤 제거 */
  background-color: #ffffff;
}

/* 중앙 정렬 */
.home-container {
  flex: 1;
  display: flex;
  flex-direction: column;
  justify-content: center; /* 세로 가운데 정렬 */
  align-items: center; /* 가로 가운데 정렬 */
  text-align: center;
  padding: 0.5rem 0.5rem;
  background-color: black;
  overflow: hidden;
}

/* 타이틀 스타일 */
.main-title {
  
  font-size: 2.8rem;
  color: #beb1b1;
  font-weight: 800;
  margin-bottom: 1rem;
}

.highlight {
  color: #00bcd4;
}

/* 설명 텍스트 진하게 수정 */
.main-description {
  font-size: 1.2rem;
  color: #bbb6b6;
  line-height: 1.6;
  margin-bottom: 2rem;
}

/* 버튼 */
.home-button {
  background-color: #00bcd4;
  color: white;
  border: none;
  padding: 0.75rem 1.5rem;
  font-size: 1.1rem;
  border-radius: 10px;
  cursor: pointer;
  transition: background-color 0.3s ease;
}

.home-button:hover {
  background-color: #0097a7;
}

/* 이용 안내 섹션 */
.info-section {
  margin-top: 4rem;
  text-align: left;
  max-width: 800px;
  margin-left: auto;
  margin-right: auto;
  background-color: #e0f7fa;
  padding: 2rem;
  border-radius: 15px;
  box-shadow: 0 4px 15px rgba(0, 0, 0, 0.1);
}

.info-title {
  font-size: 1.8rem;
  color: #00bcd4;
  margin-bottom: 1.5rem;
  font-weight: bold;
}

.info-list {
  list-style: none;
  padding: 0;
  line-height: 1.8;
  color: #333333;
  font-size: 1.05rem;
}

.info-list li {
  margin-bottom: 1rem;
  background-color: rgba(255, 255, 255, 0.7);
  padding: 1rem;
  border-radius: 10px;
}

.label {
  font-weight: bold;
  color: #00bcd4;
  margin-right: 0.5rem;
  text-decoration: none;
  transition: transform 0.2s ease-in-out;
}

.labelrouter {
  font-weight: bold;
  color: #00bcd4;
  margin-right: 0.5rem;
  text-decoration: none;
  transition: transform 0.2s ease-in-out;
}

.footer {
  height: 60px;
  background-color: #000000;
  color: #cccccc;
  font-size: 0.95rem;
  text-align: center;
  line-height: 60px;
  flex-shrink: 0;
}

.no-hover {
  cursor: pointer;
  user-select: none;
  outline: none;
}
.no-hover:hover {
  background: none !important;
  color: inherit !important;
  text-decoration: none !important;
}
</style>
