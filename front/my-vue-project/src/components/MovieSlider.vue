<template>
  <div class="movie-slider container my-4">
    <h2 class="slider-title mb-3">{{ title }}</h2>

    <div class="slider-wrapper position-relative">
      <button class="slider-btn left" @click="prev" :disabled="startIndex === 0">◀</button>

      <div class="row slider-content">
        <div
          class="col-12 col-sm-6 col-lg-3 mb-4"
          v-for="movie in visibleMovies"
          :key="movie.id"
        >
          <MovieCard :movie="movie" />
        </div>
      </div>

      <button
        class="slider-btn right"
        @click="next"
        :disabled="startIndex + itemsPerPage >= movies.length"
      >
        ▶
      </button>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted, onBeforeUnmount } from 'vue'
import MovieCard from '@/components/MovieCard.vue'

const props = defineProps({
  movies: Array,
  title: String
})

const startIndex = ref(0)
const itemsPerPage = ref(4)

function updateItemsPerPage() {
  const width = window.innerWidth
  if (width < 576) {
    itemsPerPage.value = 1
  } else if (width < 992) {
    itemsPerPage.value = 2
  } else {
    itemsPerPage.value = 4
  }

  // 범위 조정
  if (startIndex.value + itemsPerPage.value > props.movies.length) {
    startIndex.value = Math.max(0, props.movies.length - itemsPerPage.value)
  }
}

onMounted(() => {
  updateItemsPerPage()
  window.addEventListener('resize', updateItemsPerPage)
})

onBeforeUnmount(() => {
  window.removeEventListener('resize', updateItemsPerPage)
})

const visibleMovies = computed(() =>
  props.movies.slice(startIndex.value, startIndex.value + itemsPerPage.value)
)

const prev = () => {
  startIndex.value = Math.max(0, startIndex.value - itemsPerPage.value)
}

const next = () => {
  if (startIndex.value + itemsPerPage.value < props.movies.length) {
    startIndex.value += itemsPerPage.value
  }
}
</script>

<style scoped>
.movie-slider {
  background-color: #1c1c1c;
  padding: 1.5rem;
  border-radius: 12px;
}

.slider-title {
  color: #ddd;
  text-align: center;
  font-size: 1.8rem;
  font-weight: 600;
  margin-bottom: 1.5rem;
}

.slider-wrapper {
  position: relative;
  display: flex;
  align-items: center;
}

.slider-content {
  flex: 1;
  margin: 0 2.5rem;
}

.slider-btn {
  position: absolute;
  top: 50%;
  transform: translateY(-50%);
  z-index: 10;
  background: none; /* 🔥 배경 제거 */
  border: none;
  font-size: 2rem;
  color: #ffffffcc;
  font-weight: bold;
  padding: 0 10px;
  transition: color 0.2s ease;
}

.slider-btn.left {
  left: 0;
}

.slider-btn.right {
  right: 0;
}

.slider-btn:hover:not(:disabled) {
  color: #ffffff;
  cursor: pointer;
}

.slider-btn:disabled {
  color: #555;
  cursor: not-allowed;
}
</style>
