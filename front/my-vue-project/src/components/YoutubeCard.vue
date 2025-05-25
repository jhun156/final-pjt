<template>
  <div class="video-card" @click="$emit('open', video)">
    <img 
      :src="video.snippet.thumbnails.medium.url" 
      :alt="video.snippet.title" 
      class="thumbnail"
    />
    <h3 class="video-title">{{ video.snippet.title }}</h3>
    <p class="video-description">{{ video.snippet.description }}</p>
  </div>
</template>

<script setup>
const props = defineProps({
  video: Object,
})

const emit = defineEmits(['open'])
</script>

<style scoped>
.video-card {
  background-color: #ffffff;
  border-radius: 12px;
  box-shadow: 0 4px 14px rgba(0, 0, 0, 0.08);
  overflow: hidden;
  transition: transform 0.2s ease, box-shadow 0.2s ease;
  cursor: pointer;
}

.video-card:hover {
  transform: translateY(-4px);
  box-shadow: 0 8px 20px rgba(0, 0, 0, 0.15);
}

.thumbnail {
  width: 100%;
  height: 180px;
  object-fit: cover;
}

.video-title {
  font-weight: bold;
  font-size: 1rem;
  margin: 0.5rem 1rem 0;
  color: #111827;
}

.video-description {
  font-size: 0.9rem;
  color: #6b7280;
  padding: 0 1rem 1rem;
  overflow: hidden;
  text-overflow: ellipsis;
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
}
</style>
