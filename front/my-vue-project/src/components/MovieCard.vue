<template>
  <RouterLink :to="{ name: 'MovieDetail', params: { movieId: movie.id }}" class="movie-card-link">
    <div class="card h-100 shadow-sm movie-card d-flex flex-column">
      <div class="poster-wrapper">
        <img
          :src="'https://image.tmdb.org/t/p/w500' + movie.poster_path"
          class="poster-img"
          alt="영화 이미지"
        />
      </div>
      <div class="card-body d-flex flex-column">
        <h5 class="card-title text-center text-primary fw-bold">{{ movie.title }}</h5>
        <p class="card-text">{{ truncatedOverview }}</p>
      </div>
    </div>
  </RouterLink>
</template>

<script setup>
import { computed } from 'vue'
const props = defineProps({
  movie: Object
})

const truncatedOverview = computed(() => {
  const text = props.movie.overview || ''
  return text.length > 100 ? text.slice(0, 100) + '...' : text
})
</script>

<style scoped>
.movie-card-link {
  text-decoration: none;
  color: inherit;
  display: block;
  transition: transform 0.2s ease, box-shadow 0.2s ease;
  border-radius: 0.25rem;
}

.movie-card-link:hover {
  transform: translateY(-6px);
  box-shadow: 0 10px 20px rgba(13, 110, 253, 0.5);
  cursor: pointer;
}

.card {
  height: 100%;
  display: flex;
  flex-direction: column;
  border-radius: 0.25rem;
}

.poster-wrapper {
  width: 100%;
  aspect-ratio: 2 / 3; /* 📐 일정한 비율 유지 */
  overflow: hidden;
  border-radius: 0.25rem 0.25rem 0 0;
  background-color: #000;
}

.poster-img {
  width: 100%;
  height: 100%;
  object-fit: cover; /* 🎯 채우되 잘리지 않도록 */
  display: block;
}

.card-body {
  flex-grow: 1;
  display: flex;
  flex-direction: column;
  padding: 1rem;
}

.card-title {
  margin-bottom: 0.75rem;
  overflow: hidden;
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow-wrap: break-word;
  white-space: pre-wrap;
  line-height: 1.2rem;
  min-height: calc(1.2rem * 2);
}

.card-text {
  overflow: hidden;
  display: -webkit-box;
  -webkit-line-clamp: 5;
  -webkit-box-orient: vertical;
  overflow-wrap: break-word;
  white-space: pre-wrap;
  color: #555;
  flex-grow: 1;
}
</style>
