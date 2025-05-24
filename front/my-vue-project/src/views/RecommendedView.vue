<template>
  <div>
    <h2>입력한 지역 날씨에 따른 영화 추천</h2>

    <div class="input-group">
      <input v-model="region" type="text" placeholder="지역명 (예: 서울)">
      <button @click="handleRegionSearch">영화 추천 받기</button>
    </div>

    <p v-if="currentWeather">현재 날씨: {{ currentWeather }}</p>

    <div v-if="recommendedMovies.length > 0">
      <h3>추천 영화</h3>
      <div v-for="movie in recommendedMovies" :key="movie.videoId" class="movie-item">
        <img
          :src="movie.thumbnail"
          :alt="movie.title"
          width="120"
          @click="openModal(movie.videoId, movie.title)"
        >
        <p @click="openModal(movie.videoId, movie.title)">{{ movie.title }}</p>
      </div>
    </div>

    <p v-else-if="!error && currentWeather">추천 영화를 불러오는 중...</p>
    <p v-if="error">{{ error }}</p>

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
.input-group {
  display: flex;
  justify-content: center;
  gap: 10px;
  margin-bottom: 20px;
}

.input-group input {
  padding: 6px;
  width: 200px;
  border: 1px solid #ccc;
  border-radius: 6px;
}

.input-group button {
  padding: 6px 12px;
  background-color: #7e57c2;
  color: white;
  border: none;
  border-radius: 6px;
  cursor: pointer;
}

.movie-item {
  display: flex;
  align-items: center;
  margin-bottom: 15px;
  background-color: #fff;
  padding: 15px;
  border-radius: 10px;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.15);
  transition: transform 0.2s ease-in-out, box-shadow 0.2s ease-in-out;
}

.movie-item:hover {
  transform: translateY(-5px);
  box-shadow: 0 8px 16px rgba(0, 0, 0, 0.2);
  cursor: pointer;
}

.movie-item img {
  width: 150px;
  height: auto;
  margin-right: 20px;
  border-radius: 8px;
  object-fit: cover;
}

.movie-item p {
  margin: 0;
  font-size: 1.1rem;
  font-weight: bold;
  color: #333;
  cursor: pointer;
}
</style>
