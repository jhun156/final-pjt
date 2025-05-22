<template>
  <div>
    <MovieDetailInfo :movie="movie"/>
  </div>
</template>

<script setup>
  import { useTMDBStore } from '@/stores/tmdb.js'
  import { useRoute } from 'vue-router'
  import { ref, onMounted } from 'vue'
  import MovieDetailInfo from '@/components/MovieDetailInfo.vue'

  const route = useRoute()
  const store = useTMDBStore()

  const movieId = route.params.movieId
  const movie = ref([])

  onMounted(async () => {
    movie.value = await store.fetchDetailMovie(movieId)
    console.log(movie.value)
  })
</script>

<style scoped>

</style>