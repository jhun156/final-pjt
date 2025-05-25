<template>
  <div class="movie-slider container my-4">
    <h2 class="slider-title mb-3">{{ title }}</h2>
    <div class="slider-controls d-flex justify-content-between mb-2">
      <button @click="prev" :disabled="startIndex === 0">&lt;</button>
      <button @click="next" :disabled="startIndex + itemsPerPage >= movies.length">&gt;</button>
    </div>

    <div class="row slider-content">
      <div
        class="col-12 col-md-6 col-lg-3 mb-4"
        v-for="movie in visibleMovies"
        :key="movie.id"
      >
        <MovieCard :movie="movie" />
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue'
import MovieCard from '@/components/MovieCard.vue'

const props = defineProps({
  movies: Array,
  title: String
})

const itemsPerPage = 4
const startIndex = ref(0)

const visibleMovies = computed(() =>
  props.movies.slice(startIndex.value, startIndex.value + itemsPerPage)
)

const prev = () => {
  if (startIndex.value >= itemsPerPage) {
    startIndex.value -= itemsPerPage
  }
}

const next = () => {
  if (startIndex.value + itemsPerPage < props.movies.length) {
    startIndex.value += itemsPerPage
  }
}
</script>

<style scoped>
.movie-slider {
  background-color: #1c1c1c; /* 어두운 회색 배경 */
  padding: 1.5rem;
  border-radius: 12px;
}

.slider-title {
  /* font-family: Georgia, 'Times New Roman', serif; 세리프 폰트 */
  color: #ddd; /* 밝은 회색 텍스트 */
  text-align: center; /* 가운데 정렬 */
  font-size: 1.8rem;
  font-weight: 600;
  margin-bottom: 1.5rem;
}

button {
  background-color: #007bff;
  color: white;
  border: none;
  padding: 6px 12px;
  border-radius: 4px;
  font-weight: bold;
  transition: background-color 0.2s ease;
}

button:hover:not(:disabled) {
  background-color: #0056b3;
  cursor: pointer;
}

button:disabled {
  background-color: #555;
  cursor: not-allowed;
}

.slider-content {
  /* row 자체는 기본 유지 */
}
</style>
