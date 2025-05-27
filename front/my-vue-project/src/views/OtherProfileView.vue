<template>
  <div class="container mt-5">
    <h2 class="text-center mb-4">{{ user.nickname }}님의 프로필 페이지</h2>

    <div class="profile-card mx-auto mb-5">
      <p><strong>닉네임:</strong> {{ user.nickname }}</p>
      <p><strong>Email:</strong> {{ user.email }}</p>
      <p><strong>성별:</strong> {{ user.gender }}</p>
      <p><strong>나이:</strong> {{ user.age }}</p>
      <p><strong>선호 장르:</strong> {{ user.genre }}</p>

      <div class="follow-box">
        <div class="follow-item">
          <div class="follow-count">{{ followers }}</div>
          <div class="follow-label">팔로워</div>
        </div>
        <div class="follow-item">
          <div class="follow-count">{{ followings }}</div>
          <div class="follow-label">팔로잉</div>
        </div>
      </div>

      <div class="text-center mt-3">
        <button class="follow-btn" @click="onFollow(user.id)">
          {{ followed ? '언팔로우' : '팔로우' }}
        </button>
      </div>
    </div>

    <h3 class="text-center mb-4">
      <strong>{{ user.nickname }}님이 Pick한 영화들</strong>
    </h3>
    <br>

    <div v-if="movies.length > 0" class="row row-cols-1 row-cols-sm-2 row-cols-md-3 row-cols-lg-4 g-4">
      <div v-for="movie in movies" :key="movie.id">
        <ProfileMovie :movie="movie" />
      </div>
    </div>

    <h5 v-else class="text-center mb-4">
      {{ user.nickname }}님이 Pick한 영화가 아직 없습니다.
    </h5>
  </div>
</template>

<script setup>
import { computed, onMounted } from 'vue'
import { useOtherProfileStore } from '@/stores/otherprofile.js'
import { useRoute } from 'vue-router'
import ProfileMovie from '@/components/ProfileMovie.vue'

const route = useRoute()
const userId = route.params.userid
const store = useOtherProfileStore()

// ✅ computed로 래핑하여 반응성 확보
const user = computed(() => store.user)
const movies = computed(() => store.movies)
const followers = computed(() => store.followers)
const followings = computed(() => store.followings)
const followed = computed(() => store.followed)

const onFollow = async () => {
  await store.follow(userId)
}

onMounted(() => {
  store.userInfo(userId)
  store.followStatus(userId)
})
</script>


<style scoped>
h2, h3, h5 {
  color: #bdc6cf;
  font-weight: bold;
}

.profile-card {
  background-color: #f4f4f4;
  border-radius: 12px;
  padding: 1.5rem 2rem;
  max-width: 600px;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.05);
  font-size: 1rem;
  color: #34495e;
}

.follow-box {
  display: flex;
  justify-content: space-around;
  gap: 1.5rem;
  margin-top: 1rem;
}

.follow-item {
  background-color: #ffffff;
  padding: 0.75rem 1.5rem;
  border-radius: 10px;
  box-shadow: 0 1px 6px rgba(0, 0, 0, 0.08);
  text-align: center;
  flex: 1;
}

.follow-count {
  font-size: 1.5rem;
  font-weight: bold;
  color: #2c3e50;
}

.follow-label {
  font-size: 0.9rem;
  color: #7f8c8d;
}

.follow-btn {
  background-color: #6c5ce7;
  color: white;
  font-weight: 600;
  padding: 0.6rem 1.5rem;
  font-size: 1rem;
  border: none;
  border-radius: 8px;
  cursor: pointer;
  transition: background-color 0.2s ease-in-out;
}

.follow-btn:hover {
  background-color: #5a4bd3;
}
</style>
