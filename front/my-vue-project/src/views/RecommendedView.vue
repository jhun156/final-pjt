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
import MovieModal from '@/components/RecommendeModal.vue';

const currentWeather = ref('');
const recommendedMovies = ref([]);
const error = ref('');

const showModal = ref(false);
const selectedVideoId = ref('');
const selectedVideoTitle = ref('');

const weatherApiKey = import.meta.env.VITE_WEATHER_API_KEY;
const youtubeApiKey = import.meta.env.VITE_YOUTUBE_API_KEY;
const openaiApiKey = import.meta.env.VITE_OPENAI_API_KEY;

const latitude = 35.1595454;
const longitude = 126.8526012;
const numberOfMoviesToFetch = 15;

async function fetchWeather() {
  try {
    const weatherApiUrl = `https://api.openweathermap.org/data/2.5/weather?lat=${latitude}&lon=${longitude}&appid=${weatherApiKey}&lang=kr&units=metric`;
    const response = await fetch(weatherApiUrl);
    if (!response.ok) throw new Error(`날씨 정보를 가져오는데 실패했습니다: ${response.status}`);

    const weatherData = await response.json();
    const weatherDescription = weatherData.weather[0].description;
    const weatherCondition = weatherData.weather[0].main;

    currentWeather.value = `${weatherDescription}, 온도: ${weatherData.main.temp}°C`;

    const searchKeyword = await getRecommendationFromOpenAI(weatherDescription);
    await fetchMoviesFromYoutube(searchKeyword);
  } catch (err) {
    error.value = err.message;
    console.error('날씨 정보 에러:', err);
  }
}

async function getRecommendationFromOpenAI(weatherDescription) {
  try {
    const response = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${openaiApiKey}`,
      },
      body: JSON.stringify({
        model: 'gpt-4-mini',
        messages: [
          {
            role: 'system',
            content: '당신은 사용자의 날씨 상황에 따라 영화 추천 키워드를 생성하는 영화 추천 전문가이자,평론가야',
          },
          {
            role: 'user',
            content: `오늘 날씨는 '${weatherDescription}'인데, 어떤 분위기의 영화를 추천해?예고편 위주로 말해줘 장르는(드라마와 영화만) (3~5글자 정도의 한국어 키워드 하나만 자연스럽게 답변해줘. 예: 감성 드라마, 흥미 스릴러, 따뜻한 가족영화)`,
          },
        ],
        temperature: 0.8,
        max_tokens: 30,
      }),
    });

    if (!response.ok) throw new Error(`OpenAI 응답 실패: ${response.status}`);

    const data = await response.json();
    const reply = data.choices[0].message.content.trim();
    return reply;
  } catch (err) {
    error.value = `OpenAI 에러: ${err.message}`;
    console.error('OpenAI API 에러:', err);
    return '추천 영화';
  }
}

async function fetchMoviesFromYoutube(searchQuery) {
  try {
    const youtubeApiUrl = `https://www.googleapis.com/youtube/v3/search?part=snippet&maxResults=${numberOfMoviesToFetch}&q=${encodeURIComponent(searchQuery)}&type=video&key=${youtubeApiKey}`;
    const response = await fetch(youtubeApiUrl);
    if (!response.ok) throw new Error(`YouTube 영화 정보를 가져오는데 실패했습니다: ${response.status}`);

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
div {
  background-color: #f4f4f4;
  padding: 20px;
  font-family: 'Noto Sans KR', sans-serif;
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
