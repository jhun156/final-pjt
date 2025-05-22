<template>
  <div>
    <h2>오늘의 광주 날씨에 따른 영화 추천</h2>
    <p>현재 날씨: {{ currentWeather }}</p>
    <div v-if="recommendedMovies.length > 0">
      <h3>추천 영화</h3>
      <div v-for="movie in recommendedMovies" :key="movie.videoId" class="movie-item">
        <img
          :src="movie.thumbnail"
          :alt="movie.title"
          width="120"
          style="cursor: pointer;"
          @click="openModal(movie.videoId, movie.title)"
        >
        <p style="cursor: pointer;" @click="openModal(movie.videoId, movie.title)">{{ movie.title }}</p>
      </div>
    </div>
    <p v-else-if="!error && currentWeather">추천 영화를 불러오는 중...</p>
    <p v-if="error">{{ error }}</p>

    <MovieModal
      v-if="showModal"
      :videoId="selectedVideoId"
      :videotitle="selectedVideoTitle"
      @close="closeModal"
    />
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import MovieModal from '@/components/RecommendeModal.vue'; // MovieModal 컴포넌트 import (경로 확인)

const currentWeather = ref('');
const recommendedMovies = ref([]);
const error = ref('');

// 모달 관련 상태
const showModal = ref(false);
const selectedVideoId = ref('');
const selectedVideoTitle = ref('');

const weatherApiKey = import.meta.env.VITE_WEATHER_API_KEY;
const youtubeApiKey = import.meta.env.VITE_YOUTUBE_API_KEY;
const latitude = 35.1595454;
const longitude = 126.8526012;
const numberOfMoviesToFetch = 15;

async function fetchWeather() {
  try {
    const weatherApiUrl = `https://api.openweathermap.org/data/2.5/weather?lat=${latitude}&lon=${longitude}&appid=${weatherApiKey}&lang=kr&units=metric`;
    const response = await fetch(weatherApiUrl);
    if (!response.ok) {
      throw new Error(`날씨 정보를 가져오는데 실패했습니다: ${response.status}`);
    }
    const weatherData = await response.json();
    currentWeather.value = `${weatherData.weather[0].description}, 온도: ${weatherData.main.temp}°C`;
    fetchMoviesFromYoutube(weatherData.weather[0].main);
  } catch (err) {
    error.value = err.message;
    console.error('날씨 정보 에러:', err);
  }
}

async function fetchMoviesFromYoutube(weatherCondition)  {
  try {
    let searchQuery = '';
    if (weatherCondition === 'Clear') {
      searchQuery = '신나는 코미디 영화';
    } else if (weatherCondition === 'Rain' || weatherCondition === 'Drizzle' || weatherCondition === 'Thunderstorm') {
      searchQuery = '감성적인 드라마 영화';
    } else if (weatherCondition === 'Snow') {
      searchQuery = '따뜻한 판타지 영화';
    } else if (weatherCondition === 'Clouds') {
      searchQuery = '흥미진진한 스릴러 영화';
    } else {
      searchQuery = '추천 영화';
    }

    const youtubeApiUrl = `https://www.googleapis.com/youtube/v3/search?part=snippet&maxResults=${numberOfMoviesToFetch}&q=${searchQuery}&type=video&key=${youtubeApiKey}`;
    const response = await fetch(youtubeApiUrl);
    if (!response.ok) {
      throw new Error(`YouTube 영화 정보를 가져오는데 실패했습니다: ${response.status}`);
    }
    const youtubeData = await response.json();
    recommendedMovies.value = youtubeData.items.map(item => ({
      title: item.snippet.title,
      videoId: item.id.videoId,
      thumbnail: item.snippet.thumbnails.medium.url,
    }));
  } catch (err) {
    error.value = `YouTube API 에러: ${err.message}`;
    console.error('YouTube API 에러:', err);
  }
}

function openModal(videoId, videoTitle) {
  selectedVideoId.value = videoId;
  selectedVideoTitle.value = videoTitle;
  showModal.value = true;
}

function closeModal() {
  selectedVideoId.value = '';
  selectedVideoTitle.value = '';
  showModal.value = false;
}

onMounted(() => {
  fetchWeather();
});
</script>

<style scoped>
/* 전체 배경 */
div {
  background-color: #f4f4f4; /* 밝은 회색 배경 */
  padding: 20px;
  font-family: 'Noto Sans KR', sans-serif; /* 예시 폰트 */
}

h2 {
  color: #333;
  text-align: center;
  margin-bottom: 20px;
  text-shadow: 1px 1px 2px rgba(0, 0, 0, 0.1);
}

p {
  color: #555;
  text-align: center;
  margin-bottom: 15px;
}

.movie-item {
  display: flex;
  align-items: center;
  margin-bottom: 15px;
  background-color: #fff;
  padding: 15px; /* 패딩 증가 */
  border-radius: 10px; /* 좀 더 둥근 모서리 */
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.15); /* 그림자 강조 */
  transition: transform 0.2s ease-in-out, box-shadow 0.2s ease-in-out;
}

.movie-item:hover {
  transform: translateY(-5px); /* 호버 시 더 많이 떠오르는 효과 */
  box-shadow: 0 8px 16px rgba(0, 0, 0, 0.2); /* 호버 시 그림자 더 강조 */
  cursor: pointer; /* 마우스 커서 변경 */
}

.movie-item img {
  width: 150px; /* 이미지 크기 약간 확대 */
  height: auto;
  margin-right: 20px;
  border-radius: 8px;
  object-fit: cover; /* 이미지가 비율에 맞춰 잘리지 않도록 */
}

.movie-item p {
  margin: 0;
  font-size: 1.1rem; /* 글자 크기 약간 확대 */
  font-weight: 500; /* 중간 정도 굵기로 변경 */
  color: #333;
}

.movie-item p {
  margin: 0;
  cursor: pointer;
  font-weight: bold;
  color: #333;
}

/* 모달 스타일 (RecommendeModal.vue에 적용) */
.modal-overlay {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-color: rgba(0, 0, 0, 0.5); /* 반투명 검정 배경 */
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 10;
}

.modal-content {
  background-color: #fff;
  padding: 20px;
  border-radius: 8px;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.2);
  position: relative;
}

.modal-close-button {
  position: absolute;
  top: 10px;
  right: 10px;
  font-size: 1.5rem;
  cursor: pointer;
  border: none;
  background: none;
  color: #777;
}

.modal-close-button:hover {
  color: #333;
}

.modal-video-container {
  width: 80vw; /* 적절한 너비 조정 */
  max-width: 600px;
  aspect-ratio: 16 / 9; /* 유튜브 영상 비율 */
}

.modal-video-container iframe {
  width: 100%;
  height: 100%;
}

.modal-title {
  margin-top: 15px;
  text-align: center;
  color: #333;
}
</style>