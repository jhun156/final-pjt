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

    <MovieModal
      v-if="showModal"
      :videoId="selectedVideoId"
      :videotitle="selectedVideoTitle"
      @close="closeModal"
    />
  </div>
</template>

<script setup>
import { ref } from 'vue';
import MovieModal from '@/components/RecommendeModal.vue';

const region = ref('');
const currentWeather = ref('');
const recommendedMovies = ref([]);
const error = ref('');
const showModal = ref(false);
const selectedVideoId = ref('');
const selectedVideoTitle = ref('');

const weatherApiKey = import.meta.env.VITE_WEATHER_API_KEY;
const youtubeApiKey = import.meta.env.VITE_YOUTUBE_API_KEY;
const geminiApiKey = import.meta.env.VITE_GEMINI_API_KEY;
const kakaoApiKey = import.meta.env.VITE_KAKAO_API_KEY;

const numberOfMoviesToFetch = 15;

async function handleRegionSearch() {
  if (!region.value.trim()) {
    error.value = '지역명을 입력해주세요.';
    return;
  }

  try {
    const kakaoUrl = `https://dapi.kakao.com/v2/local/search/keyword.json?query=${encodeURIComponent(region.value)}`;
    const res = await fetch(kakaoUrl, {
      headers: {
        Authorization: `KakaoAK ${kakaoApiKey}`,
      },
    });

    if (!res.ok) throw new Error('지역 정보를 가져오지 못했습니다.');
    const data = await res.json();

    if (data.documents.length === 0) {
      error.value = '해당 지역을 찾을 수 없습니다.';
      return;
    }

    const { y: lat, x: lon } = data.documents[0];
    await fetchWeather(lat, lon);
  } catch (err) {
    error.value = `위치 변환 에러: ${err.message}`;
    console.error('📍 Kakao 위치 API 에러:', err);
  }
}

async function fetchWeather(lat, lon) {
  try {
    const weatherApiUrl = `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&appid=${weatherApiKey}&lang=kr&units=metric`;
    const response = await fetch(weatherApiUrl);
    if (!response.ok) throw new Error(`날씨 정보를 가져오는데 실패했습니다: ${response.status}`);

    const weatherData = await response.json();
    const weatherDescription = weatherData.weather[0].description;
    currentWeather.value = `${weatherDescription}, 온도: ${weatherData.main.temp}°C`;

    const searchKeyword = await getRecommendationFromGemini(weatherDescription);
    console.log('📌 Gemini 추천 키워드:', searchKeyword);

    if (!searchKeyword || searchKeyword.length < 2) {
      error.value = '추천 키워드를 생성하지 못했습니다.';
      return;
    }

    await fetchMoviesFromYoutube(`${searchKeyword} 예고편`);
  } catch (err) {
    error.value = err.message;
    console.error('날씨 정보 에러:', err);
  }
}

async function getRecommendationFromGemini(weatherDescription) {
  try {
    const geminiModel = "models/gemini-1.5-flash";
    const geminiUrl = `https://generativelanguage.googleapis.com/v1/${geminiModel}:generateContent?key=${geminiApiKey}`;

    const response = await fetch(geminiUrl, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        contents: [
          {
            parts: [
              {
                text: `
                        당신은 영화 추천 전문가입니다.

                        오늘 날씨는 '${weatherDescription}'입니다.
                        이 날씨에 어울리는 영화 예고편을 검색할 수 있는 **짧은 한국어 키워드 하나**를 추천해 주세요.

                        ❗ 반드시 지켜야 할 조건:
                        - 3~6자 이내의 하나의 영화 분위기 키워드만 출력하세요.
                        - 예고편이 실제로 존재할 수 있는 영화 장르 기반 키워드만 추천하세요.

                        ❌ 금지 키워드:
                        '노래', '음악', '플레이리스트', '드라마', 'OST', '연주', '팝송' 등의 단어는 절대 포함하지 마세요.

                        ✅ 출력 예시:
                        따뜻한 가족영화
                        스산한 미스터리 영화
                        흥미 스릴러 영화
                        잔잔한 로맨스 영화화

                        **출력은 키워드 하나만, 설명 없이!**
                `.trim(),
              },
            ],
          },
        ],
        generationConfig: {
          temperature: 0.8,
          maxOutputTokens: 30,
        },
      }),
    });

    if (!response.ok) {
      if (response.status === 429) {
        throw new Error('요청이 너무 많습니다. 잠시 후 다시 시도해주세요.');
      }
      const errorText = await response.text();
      throw new Error(`Gemini 응답 실패: ${response.status} - ${errorText}`);
    }

    const data = await response.json();
    const reply = data.candidates?.[0]?.content?.parts?.[0]?.text?.trim();

    const forbidden = ['노래', '음악', '플레이리스트', '드라마', 'OST', '연주', '팝송'];
    if (forbidden.some(word => reply?.includes(word))) {
      console.warn('🚫 필터링된 응답:', reply);
      return '흥미 스릴러';
    }

    return reply || '흥미 스릴러';
  } catch (err) {
    console.error('Gemini API 에러:', err);
    return '흥미 스릴러';
  }
}

async function fetchMoviesFromYoutube(searchQuery) {
  try {
    const youtubeApiUrl = `https://www.googleapis.com/youtube/v3/search?part=snippet&maxResults=${numberOfMoviesToFetch}&q=${encodeURIComponent(searchQuery)}&type=video&key=${youtubeApiKey}`;
    const response = await fetch(youtubeApiUrl);
    if (!response.ok) throw new Error(`YouTube 영화 정보를 가져오는데 실패했습니다: ${response.status}`);

    const youtubeData = await response.json();

    if (!youtubeData.items || youtubeData.items.length === 0) {
      error.value = `'${searchQuery}'에 대한 예고편을 찾을 수 없습니다.`;
      return;
    }

    recommendedMovies.value = youtubeData.items.map(item => ({
      title: item.snippet.title,
      videoId: item.id.videoId,
      thumbnail: item.snippet.thumbnails.medium.url,
    }));

    console.log('🎥 추천 영화 목록:', recommendedMovies.value);
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
