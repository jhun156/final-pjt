<template>
  <div class="container">
    <h1 class="title">🎬 MOVIE 월드에 오신 걸 환영</h1>
    <p class="subtitle">
      지금 인기 있는 영화들을 살펴보고, 리뷰를 검색하여<br />
      영화 리뷰를 감상해봐요
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
        v-for="(video, index) in store.youtubeList"
        :key="video.etag || index"
        :video="video"
        @open="handleOpen"
      />
    </div>

    <YoutubeReviewModal
      v-if="isModalOpen"
      :videoId="selectedVideo?.id.videoId"
      :videotitle="selectedVideo?.snippet.title"
      @close="isModalOpen = false"
    />
  </div>
</template>

<script setup>
import { ref } from 'vue'
import { useYoutubeStore } from '@/stores/youtube.js'
import YouTubeCard from '@/components/YouTubeCard.vue'
import YoutubeReviewModal from '@/components/YoutubeReviewModal.vue'

const query = ref('')
const store = useYoutubeStore()

const isModalOpen = ref(false)
const selectedVideo = ref(null)

const onsearchYoutube = () => {
  store.searchYoutube(30, query.value)
}

const handleOpen = (video) => {
  selectedVideo.value = video
  isModalOpen.value = true
}
</script>

<style scoped>
.container {
  max-width: 1200px;
  margin: 2rem auto;
  padding: 2rem;
  background: linear-gradient(to bottom, #ffffff, #f9f9f9);
  border-radius: 16px;
  box-shadow: 0 8px 24px rgba(0, 0, 0, 0.1);
  font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
  display: flex;
  flex-direction: column;
  gap: 2rem;
}

.title {
  font-size: 2.8rem;
  font-weight: 800;
  color: #06b6d4;
  text-align: center;
  margin: 0;
}

.subtitle {
  color: #6b7280;
  font-size: 1.125rem;
  text-align: center;
  line-height: 1.6;
  margin: 0;
}

.search-area {
  display: flex;
  flex-wrap: wrap;
  gap: 1rem;
  justify-content: center;
}

.search-input {
  flex: 1 1 300px;
  padding: 0.75rem 1.25rem;
  border: 1px solid #d1d5db;
  border-radius: 0.5rem;
  font-size: 1rem;
}

.search-input:focus {
  border-color: #22d3ee;
  box-shadow: 0 0 0 3px rgba(34, 211, 238, 0.3);
  outline: none;
}

.search-button {
  background-color: #06b6d4;
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
  background-color: #0e7490;
}

.video-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
  gap: 1.5rem;
}
</style>
