<template>
  <div class="container mt-4">
    <h1 class="mb-3">{{ user.username }} 님의 프로필 페이지</h1>
    <div class="mb-4">
      <p>가입번호 : {{ user.id }}</p>
      <p>ID : {{ user.username }}</p>
      <p>Email : {{ user.email }}</p>
      <p>팔로워 : {{ followers }} | 팔로잉 : {{ followings }}</p>
      <button @click="onFollow(user.id)">
        {{ followed ? '언팔로우' : '팔로우' }}
      </button>

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
import { ref, computed, onMounted, watch } from 'vue'
import { useOtherProfileStore } from '@/stores/otherprofile.js'
import { useUserStore } from '@/stores/auth.js'
import { useRoute } from 'vue-router'
import ProfileMovie from '@/components/ProfileMovie.vue'
import axios from 'axios'

const otherProfileStore = useOtherProfileStore()
const route = useRoute()

const movies = otherProfileStore.movies
const user = otherProfileStore.user
const userId = route.params.userid

const followed = otherProfileStore.followed
const followers = otherProfileStore.followers
const followings = otherProfileStore.followings

const onFollow = async function (userId) {
  await otherProfileStore.follow(userId)
  await otherProfileStore.followStatus(userId)
}

onMounted(() => {
  otherProfileStore.userInfo(userId)
  otherProfileStore.followStatus(userId)
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