<template>
  <div class="movie-card h-100" @click="goDetail(movie.movie_num)">
    <img
      :src="'https://image.tmdb.org/t/p/w500/' + movie.poster"
      alt="영화 포스터"
      class="movie-img"
    />
    <div class="movie-text mt-2">
      <strong>{{ movie.title }}</strong>
      <p class="movie-description">{{ movie.description }}</p>
    </div>
  </div>
</template>

<script setup>
import { useRouter } from 'vue-router'


const props = defineProps({
  movie: Object,
})
const router = useRouter()

const goDetail = (movieId) => {
  console.log('영화 클릭됨! ID:', movieId)
  router.push({ name: 'MovieDetail', params: { movieId: `${movieId}` } })
}
</script>

<style scoped>
.movie-card {
  background-color: #ffffff;
  border-radius: 12px;
  padding: 0.75rem;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.08);
  transition: transform 0.2s ease-in-out;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
}

.movie-card:hover {
  transform: translateY(-5px);
}

.movie-img {
  width: 100%;
  height: 200px;
  object-fit: cover;
  border-radius: 8px;
}

.movie-text {
  text-align: center;
}

.movie-description {
  font-size: 0.85rem;
  color: #555;
  margin-top: 6px;
  display: -webkit-box;
  -webkit-line-clamp: 3;
  -webkit-box-orient: vertical;
  overflow: hidden;
  text-overflow: ellipsis;
}
</style>
