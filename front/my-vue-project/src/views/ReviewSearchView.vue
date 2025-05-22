<template>
  <div class="container">
    <h1 class="title">
      SSAFY 무비 월드에 오신 걸 환영
    </h1>
    <p class="subtitle">
      지금 인기 있는 영화들을 살펴보고, 리뷰를 검색하며<br />
      당신만을 위한 영화를 추천받아보세요!
    </p>

    <div class="search-area">
      <input
        v-model="query"
        placeholder="영화 제목 입력"
        class="search-input"
      />
      <button
        @click="onsearchYoutube"
        class="search-button"
      >
        영화 둘러보기
      </button>
    </div>

    <div class="video-grid">
      <YouTubeCard
        v-for="video in store.youtubeList"
        :key="video.id.videoId"
        :video="video"
      />
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import { useYoutubeStore } from '@/stores/youtube.js'
import YouTubeCard from '@/components/YoutubeCard.vue'

const query = ref('')
const store = useYoutubeStore()

const onsearchYoutube = () => {
  store.searchYoutube(10, query.value)
}
</script>

<style scoped>
.container {
  max-width: 768px;
  margin: 0 auto;
  padding: 2rem;
  background-color: white;
  border-radius: 1rem;
  box-shadow: 0 8px 24px rgba(0,0,0,0.1);
  font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
  display: flex;
  flex-direction: column;
  gap: 2rem;
}

.title {
  font-size: 2.5rem;
  font-weight: 800;
  color: #06b6d4; /* cyan-600 */
  text-align: center;
  margin: 0;
}

.subtitle {
  color: #9ca3af; /* gray-400 */
  font-size: 1.125rem;
  text-align: center;
  line-height: 1.6;
  margin: 0;
}

.search-area {
  display: flex;
  gap: 1rem;
  max-width: 500px;
  margin: 0 auto;
}

.search-input {
  flex-grow: 1;
  padding: 0.75rem 1.25rem;
  border: 1px solid #d1d5db; /* gray-300 */
  border-radius: 0.5rem;
  font-size: 1rem;
  outline: none;
  transition: box-shadow 0.2s ease;
}

.search-input:focus {
  box-shadow: 0 0 0 3px #22d3ee; /* cyan-400 */
  border-color: #22d3ee;
}

.search-button {
  background-color: #06b6d4; /* cyan-600 */
  color: white;
  font-weight: 600;
  border: none;
  border-radius: 0.5rem;
  padding: 0.75rem 1.5rem;
  cursor: pointer;
  font-size: 1rem;
  transition: background-color 0.3s ease;
}

.search-button:hover {
  background-color: #0e7490; /* cyan-700 */
}

.video-grid {
  display: grid;
  grid-template-columns: 1fr;
  gap: 2rem;
}

@media (min-width: 640px) {
  .video-grid {
    grid-template-columns: repeat(2, 1fr);
  }
}
</style>
