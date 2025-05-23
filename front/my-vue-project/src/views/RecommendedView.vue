<template>
  <div class="container">
    <h1 class="title">🎯 입력한 지역 날씨에 따른 영화 추천</h1>

    <div class="search-box">
      <input v-model="region" type="text" placeholder="지역명 (예: 서울)" />
      <button @click="handleRegionSearch">영화 추천 받기</button>
    </div>

    <p v-if="currentWeather" class="weather-text">📍 현재 날씨: <strong>{{ currentWeather }}</strong></p>

    <div v-if="recommendedMovies.length > 0">
      <h2 class="subtitle">🎬 추천 영화 목록</h2>
      <div class="movie-grid">
        <div v-for="movie in recommendedMovies" :key="movie.videoId" class="movie-card" @click="openModal(movie.videoId, movie.title)">
          <img :src="movie.thumbnail" :alt="movie.title" />
          <p class="movie-title">{{ movie.title }}</p>
        </div>
      </div>
    </div>

    <p v-else-if="!error && currentWeather" class="loading">추천 영화를 불러오는 중...</p>
    <p v-if="error" class="error">{{ error }}</p>

    <RecommendeModal
      v-if="showModal"
      :videoId="selectedVideoId"
      :videotitle="selectedVideoTitle"
      @close="closeModal"
    />
  </div>
</template>

<script setup>
import { computed } from 'vue'
import { useRegionStore } from '@/stores/useRegionStore';
import { useWeatherStore } from '@/stores/useWeatherStore';
import { useMovieStore } from '@/stores/useMovieStore';
import RecommendeModal from '@/components/RecommendeModal.vue';

const regionStore = useRegionStore();
const weatherStore = useWeatherStore();
const movieStore = useMovieStore();

const region = computed({
  get: () => regionStore.region,
  set: (val) => regionStore.region = val
});

const currentWeather = computed(() => weatherStore.currentWeather);
const error = computed(() => movieStore.error);
const recommendedMovies = computed(() => movieStore.recommendedMovies);
const showModal = computed(() => movieStore.showModal);
const selectedVideoId = computed(() => movieStore.selectedVideoId);
const selectedVideoTitle = computed(() => movieStore.selectedVideoTitle);

async function handleRegionSearch() {
  const coords = await regionStore.fetchCoordinates();
  if (!coords) return;

  const keyword = await weatherStore.fetchWeather(coords.lat, coords.lon);
  if (!keyword) return;

  await movieStore.fetchMovies(keyword);
}

function openModal(videoId, title) {
  movieStore.openModal(videoId, title);
}

function closeModal() {
  movieStore.closeModal();
}
</script>

<style scoped>
.container {
  max-width: 1100px;
  margin: 2rem auto;
  padding: 2rem;
  background-color: #fdfdfd;
  border-radius: 16px;
  box-shadow: 0 6px 24px rgba(0, 0, 0, 0.08);
  font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
}

.title {
  text-align: center;
  font-size: 2.2rem;
  color: #3b82f6;
  margin-bottom: 1rem;
  font-weight: 800;
}

.search-box {
  display: flex;
  justify-content: center;
  gap: 1rem;
  margin-bottom: 1.5rem;
}

.search-box input {
  width: 220px;
  padding: 0.6rem 1rem;
  border: 1px solid #ccc;
  border-radius: 6px;
  font-size: 1rem;
}

.search-box button {
  padding: 0.6rem 1.2rem;
  background-color: #7e57c2;
  color: white;
  border: none;
  border-radius: 6px;
  font-weight: bold;
  cursor: pointer;
  transition: background-color 0.2s ease;
}

.search-box button:hover {
  background-color: #5e35b1;
}

.weather-text {
  text-align: center;
  font-size: 1.1rem;
  margin-bottom: 1.5rem;
  color: #555;
}

.subtitle {
  font-size: 1.4rem;
  font-weight: bold;
  margin-bottom: 1rem;
  color: #333;
}

.movie-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(220px, 1fr));
  gap: 1.5rem;
}

.movie-card {
  background-color: #ffffff;
  padding: 1rem;
  border-radius: 12px;
  box-shadow: 0 4px 14px rgba(0, 0, 0, 0.08);
  transition: transform 0.2s ease, box-shadow 0.2s ease;
  cursor: pointer;
  text-align: center;
}

.movie-card:hover {
  transform: translateY(-4px);
  box-shadow: 0 8px 18px rgba(0, 0, 0, 0.15);
}

.movie-card img {
  width: 100%;
  height: 160px;
  object-fit: cover;
  border-radius: 8px;
  margin-bottom: 0.75rem;
}

.movie-title {
  font-weight: 600;
  font-size: 1rem;
  color: #111827;
}

.loading {
  text-align: center;
  font-style: italic;
  color: #888;
}

.error {
  text-align: center;
  color: red;
  font-weight: bold;
}
</style>
