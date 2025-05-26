<template>
  <div>
    <MovieSlider title="높은 평점작" :movies="topratedmovies" />
    <MovieSlider title="인기 상영작" :movies="popularmovies" />
    <MovieSlider title="현재 상영작" :movies="nowplayingmovies" />
    <MovieSlider title="최신 개봉작" :movies="latestmovies" />
  </div>
</template>

<script setup>
import MovieSlider from '@/components/MovieSlider.vue'
import { ref, onMounted } from 'vue'
import { useTMDBStore } from '@/stores/tmdb'

const store = useTMDBStore()

const topratedmovies = ref([])
const popularmovies = ref([])
const nowplayingmovies = ref([])
const latestmovies = ref([])

onMounted(async () => {
  topratedmovies.value = await store.fetchTopRatedMovies()
  popularmovies.value = await store.fetchPopularMovies()
  nowplayingmovies.value = await store.fetchNowPlayingMovies()
  latestmovies.value = await store.fetchLatestMovies()
})
</script>


<style scoped>
.movie-list {
  /* background-color: #121212; */
  min-height: 100vh;
  /* color: #ffffff; */
  padding-bottom: 2rem;
}

.movie-link {
  text-decoration: none;
  color: inherit;
  display: block;
  transition: transform 0.2s ease, box-shadow 0.2s ease;
  border-radius: 8px;
}

.movie-link:hover {
  transform: translateY(-6px);
  box-shadow: 0 8px 20px rgba(0, 188, 212, 0.5);
  cursor: pointer;
}

.section-title {
  font-size: 1.5rem;
  font-weight: bold;
  margin-bottom: 1rem;
}

.slider-controls {
  display: flex;
  justify-content: space-between;
  max-width: 100%;
  margin-bottom: 0.5rem;
}

.slider-controls button {
  background-color: #00bcd4;
  color: white;
  border: none;
  padding: 0.5rem 1rem;
  font-weight: bold;
  border-radius: 8px;
  cursor: pointer;
}

.slider-controls button:disabled {
  background-color: #555;
  cursor: not-allowed;
}

.horizontal-slide {
  display: flex;
  gap: 1rem;
  overflow: hidden;
}

.movie-card-wrapper {
  min-width: 250px;
  flex: 0 0 auto;
}
</style>
