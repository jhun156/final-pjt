<template>
  <RouterLink :to="{ name: 'MovieDetail', params: { movieId: movie.id }}" class="movie-card-link">
    <div class="card h-100 shadow-sm movie-card d-flex flex-column">
      <img
        :src="'https://image.tmdb.org/t/p/w500' + movie.poster_path"
        class="card-img-top"
        alt="영화 이미지"
      />
      <div class="card-body d-flex flex-column">
        <h5 class="card-title text-center text-primary fw-bold">{{ movie.title }}</h5>
        <p class="card-text">{{ movie.overview }}</p>
      </div>
    </div>
  </RouterLink>
</template>

<script setup>
const props = defineProps({
  movie: Object
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

.card-img-top {
  width: 100%;
  height: auto; /* 이미지 비율 유지 */
  max-height: 300px; /* 최대 높이 제한 */
  object-fit: contain; /* 짤리지 않고 이미지 전체 보임 */
  border-radius: 0.25rem 0.25rem 0 0;
  background-color: #000; /* 빈공간 검정 배경 */
}

.card-body {
  flex-grow: 1;
  display: flex;
  flex-direction: column;
  padding: 1rem;
}

.card-title {
  margin-bottom: 0.75rem;
}

.card-text {
  overflow-wrap: break-word;
  flex-grow: 1;
  white-space: pre-wrap; /* 줄 바꿈 유지 */
  color: #555;
}
</style>
