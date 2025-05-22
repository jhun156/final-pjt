<template>
  <div>
    <img :src="'https://image.tmdb.org/t/p/w500/'+movie.poster" alt="좋아하는 영화">
    <div>
      {{ movie.title }}
      {{ movie.description }}
    </div>
  </div>
</template>

<script setup>
  const props = defineProps({
    movie: Object
  })

</script>

<style scoped>
  img {
    width: 100%;
    height: 150px;
    object-fit: cover;
    border-radius: 8px;
    box-shadow: 0 2px 6px rgba(0, 0, 0, 0.1);
    margin-bottom: 8px;
  }

  div {
    text-align: center;
  }

  div > div {
    font-size: 14px;
    color: #555;
    margin-top: 4px;
  }
</style>

