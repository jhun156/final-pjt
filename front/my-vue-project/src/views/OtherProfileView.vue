<template>
  <div class="container mt-4">
    <h1 class="mb-3">프로필 페이지</h1>
    <div class="mb-4">
      <p>가입번호 : {{ user.id }}</p>
      <p>ID : {{ user.username }}</p>
      <p>Email : {{ user.email }}</p>
      <button @click="onFollow(user.id)">
        {{ isFollowed ? '언팔로우' : '팔로우' }}
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
import { ref, onMounted, watch, onBeforeUnmount } from 'vue'
import { useOtherProfileStore } from '@/stores/otherprofile.js'
import { useRoute } from 'vue-router'
import ProfileMovie from '@/components/ProfileMovie.vue'
import axios from 'axios'
import { useUserStore } from '@/stores/auth'

const store = useOtherProfileStore()
const movies = store.movies
const user = store.user
const route = useRoute()
const userId = route.params.userid
const userstore = useUserStore()

const isFollowed = ref(false)

const fetchFollowStatus = () => {
  axios({
    method: 'get',
    url: `http://localhost:8000/${userId}/follow/`,
    headers: {
      Authorization: `Token ${userstore.token}`
    }
  })
    .then(res => {
      isFollowed.value = res.data.is_followed
    })
    .catch(err => {
      console.error('팔로우 상태 조회 실패:', err.response)
    })
}

const onFollow = function (pk) {
  axios({
    method: 'post',
    url: `http://localhost:8000/${pk}/follow/`,
    headers: {
      Authorization: `Token ${userstore.token}`
    }
  })
    .then(res => {
      console.log('팔로우 토글 성공', res.data)
      isFollowed.value = res.data.followed
    })
    .catch(err => {
      console.error('에러', err.response)
    })
}

onMounted(() => {
  store.user.value = {}       // 초기화해서 이전 데이터 지우기!!
  store.movies.value = []     // 초기화!!
  store.userInfo(userId)
  fetchFollowStatus()
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