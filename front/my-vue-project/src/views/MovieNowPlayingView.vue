<template>
  <div class="container py-4 movie-list">
    <div class="row">
      <div
        class="col-12 col-md-6 col-lg-4 mb-4"
        v-for="movie in movies"
        :key="movie.id"
      >
        <RouterLink :to="{ name: 'MovieDetail', params: { movieId: movie.id } }" class="movie-link">
          <MovieCard :movie="movie" />
        </RouterLink>
      </div>
    </div>
    <RouterView />
  </div>
</template>

<script setup>
import MovieCard from '@/components/MovieCard.vue'
import { RouterLink, RouterView } from 'vue-router'
import { useTMDBStore } from '@/stores/tmdb.js'
import { ref, onMounted } from 'vue'

const tmdbstore = useTMDBStore()
const movies = ref([])

onMounted(async () => {
  movies.value = await tmdbstore.fetchNowPlayingMovies()
})
</script>

<style scoped>
.movie-list {
  /* background-color: #121212; */
  min-height: 100vh;
  color: #ffffff;
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
</style>
