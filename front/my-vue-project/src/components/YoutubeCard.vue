<template>
  <div class="video-card">
    <img 
      :src="video.snippet.thumbnails.medium.url" 
      :alt="video.snippet.title" 
      @click="openModal" 
      class="thumbnail"
      role="button"
      tabindex="0"
      @keydown.enter="openModal"
    />
    <h3 class="video-title">{{ video.snippet.title }}</h3>
    <p class="video-description">{{ video.snippet.description }}</p>

    <!-- 모달 -->
    <YoutubeReviewModal 
      v-if="isModalOpen" 
      :videoId="video.id.videoId"
      :videotitle="video.snippet.title" 
      @close="closeModal" 
    />
  </div>
</template>

<script setup>
import { ref } from 'vue'
import YoutubeReviewModal from './YoutubeReviewModal.vue'

const props = defineProps({
  video: Object,
})

const isModalOpen = ref(false)

function openModal() {
  isModalOpen.value = true
}

function closeModal() {
  isModalOpen.value = false
}
</script>

<style scoped>
.video-card {
  max-width: 350px;
  margin: 1rem;
  cursor: pointer;
}

.thumbnail {
  width: 100%;
  border-radius: 10px;
  object-fit: cover;
  user-select: none;
}

.video-title {
  font-weight: 600;
  font-size: 1.1rem;
  margin: 0.5rem 0 0.25rem;
}

.video-description {
  font-size: 0.9rem;
  color: #555;
  overflow: hidden;
  text-overflow: ellipsis;
  display: -webkit-box;
  -webkit-line-clamp: 2; /* 2줄까지 자르기 */
  -webkit-box-orient: vertical;
}
</style>
