<template>
  <div class="container mt-4">
    <h1 class="mb-3">나의 프로필 페이지</h1>
    <div class="mb-4">
      <p>가입번호 : {{ user.id }}</p>
      <p>ID : {{ user.username }}</p>
      <p>Email : {{ user.email }}</p>
      <p>팔로워 : {{ followers }} | 팔로잉 : {{ followings }}</p>
    </div>
    <div class="row">
      <div
        class="col-6 col-sm-4 col-md-3 col-lg-2 mb-4"
        v-for="movie in movies"
        :key="movie.id"
      >
        <ProfileMovie :movie="movie" />
      </div>
    </div>
  </div>
</template>


<script setup>
  import { onMounted, computed } from 'vue'
  import { useProfileStore } from '@/stores/profile.js'
  import ProfileMovie from '@/components/ProfileMovie.vue'

  const profileStore = useProfileStore()
  const movies = computed(() => profileStore.movies)
  const user = computed(() => profileStore.user)

  const followers = computed(() => profileStore.followers)
  const followings = computed(() => profileStore.followings)

  onMounted(() => {
    profileStore.userInfo()
    profileStore.myFollowStatus()
  })
  
</script>

<style scoped>
h1 {
  font-size: 2rem;
  margin-bottom: 1rem;
  color: #2c3e50;
}

p {
  font-size: 1rem;
  margin: 0.3rem 0;
  color: #34495e;
}

ul {
  list-style: none;
  padding: 0;
  margin-top: 1.5rem;
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(220px, 1fr));
  gap: 1rem;
}

li {
  background-color: #f9f9f9;
  border: 1px solid #ddd;
  border-radius: 10px;
  padding: 1rem;
  box-shadow: 2px 2px 8px rgba(0,0,0,0.1);
  transition: transform 0.2s;
}

li:hover {
  transform: translateY(-5px);
}
</style>
