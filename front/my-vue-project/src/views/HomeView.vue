<template>
  <div class="home-container">
    <h1 class="main-title">MOVIE 월드에 오신 걸 환영합니다! 🎬</h1>
    <p class="main-description">
      지금 인기 있는 영화들을 살펴보고, 리뷰를 검색하거나<br />
      당신만을 위한 영화를 추천받아보세요!
    </p>
    <RouterLink :to="{ name: 'MovieList' }">
      <button class="home-button">영화 둘러보기</button>
    </RouterLink>
  </div>
</template>

<script setup>
import { RouterLink } from 'vue-router'
</script>

<style scoped>
.home-container {
  text-align: center;
  margin-top: 100px;
  padding: 2rem;
  color: #ffffff;
}

.main-title {
  font-size: 2.5rem;
  color: #00bcd4;
  font-weight: 800;
  margin-bottom: 1rem;
}

.main-description {
  font-size: 1.2rem;
  color: #cccccc;
  line-height: 1.6;
  margin-bottom: 2rem;
}

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
</style>
