<template>
  <div class="container py-4 movie-detail">
    <div class="image-wrapper">
      <img
        :src="'https://image.tmdb.org/t/p/w500' + movie.poster_path"
        alt="상세 이미지"
        class="movie-poster"
      />
      <transition name="like-pop" mode="out-in">
        <div
          :key="is_like"
          class="like-icon"
          :class="is_like ? 'fas fa-heart liked' : 'far fa-heart'"
          @click="toggleLike"
        ></div>
      </transition>
    </div>

    <h3 class="text-center mb-3">{{ movie.title }} 상세 페이지</h3>
    <p class="text-center mb-1"><strong>개봉일:</strong> {{ movie.release_date }}</p>
    <p class="text-center mb-1"><strong>러닝타임:</strong> {{ movie.runtime }}분</p>
    <p class="text-center mb-3"><strong>TMDB 평점:</strong> {{ movie.vote_average }}</p>

    <div v-if="movie.genres && movie.genres.length >= 2" class="text-center mb-3">
      <h5 class="fw-semibold">장르</h5>
      <p>{{ movie.genres.map(g => g.name).join(' | ') }}</p>
    </div>

    <h5 class="fw-semibold text-center mb-2">줄거리</h5>
    <p class="mb-4">{{ movie.overview }}</p>

    <div class="cast-wrapper">
      <button class="arrow left" :class="{ 'disabled-arrow': isAtStart }" @click="scrollLeft" :disabled="isAtStart" :aria-disabled="isAtStart">◀</button>
      <div class="cast-slider" ref="sliderRef" @scroll="onScroll">
        <div class="person-card" v-if="director">
          <img v-if="director.profile_path" :src="`https://image.tmdb.org/t/p/w185${director.profile_path}`" alt="감독 이미지">
          <img v-if="!director.profile_path" src="@/assets/noposter.png" alt="no poster 이미지" class="noposter">
          <p><strong>감독</strong></p>
          <p>{{ director.original_name }}</p>
          <p v-if="director.original_name !== director.name">{{ director.name }}</p>
        </div>
        <div class="person-card" v-for="cast in casts" :key="cast.cast_id">
          <img v-if="cast.profile_path" :src="`https://image.tmdb.org/t/p/w185${cast.profile_path}`" alt="출연진 이미지">
          <img v-if="!cast.profile_path" src="@/assets/noposter.png" alt="no poster 이미지" class="noposter">
          <p><strong>{{ cast.character }}</strong></p>
          <p>{{ cast.original_name }}</p>
          <p v-if="cast.original_name !== cast.name">{{ cast.name }}</p>
        </div>
      </div>
      <button class="arrow right" @click="scrollRight" :class="{ 'disabled-arrow': isAtEnd }" :disabled="isAtEnd" :aria-disabled="isAtEnd">▶</button>
    </div>

    <h5 class="fw-semibold text-center mb-3">공식 예고편</h5>
    <div class="d-flex justify-content-center mb-3">
      <img 
        src="@/assets/preview.png" 
        alt="trailer" 
        @click="openModal" 
        class="trailer-btn"
        role="button"
      />
    </div>

    <YoutubeTrailerModal 
      v-if="isModalOpen" 
      :movie="movie" 
      @close="closeModal" 
    />

    <div>
      <Comments
        :movie="movie"
      />
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import axios from 'axios'
import { useUserStore } from '@/stores/auth.js'
import YoutubeTrailerModal from '../components/YoutubeTrailerModal.vue'
import Comments from '@/components/Comments.vue'

const is_like = ref(false)
const isModalOpen = ref(false)
const sliderRef = ref(null)
const isAtStart = ref(true) // 새로 추가됨
const isAtEnd = ref(false) // 새로 추가됨

const props = defineProps({
  movie: Object
})

const casts = computed(() => {
  return (props.movie.credits?.cast || []).slice(0, 10)
})

const director = computed(() => {
  return props.movie.credits?.crew?.find(person => person.job === 'Director') || null
})

// 좌우 스크롤 버튼 동작
const scrollLeft = () => {
  sliderRef.value.scrollBy({ left: -200, behavior: 'smooth' })
}
const scrollRight = () => {
  sliderRef.value.scrollBy({ left: 200, behavior: 'smooth' })
}

// 스크롤 위치 체크 함수
const checkScrollPosition = () => {
  if (!sliderRef.value) return
  isAtStart.value = sliderRef.value.scrollLeft <= 1
  isAtEnd.value = sliderRef.value.scrollLeft + sliderRef.value.clientWidth >= sliderRef.value.scrollWidth - 1
}

const onScroll = () => {
  checkScrollPosition()
}

function openModal() {
  isModalOpen.value = true
}

function closeModal() {
  isModalOpen.value = false
}

const toggleLike = async () => {
  if (is_like.value) {
    await deleteMovie()
  } else {
    await onLike()
  }
  is_like.value = !is_like.value
}

const onLike = async () => {
  const store = useUserStore()
  try {
    await axios({
      method: 'post',
      url: 'http://localhost:8000/movie/',
      headers: {
        Authorization: `Token ${store.token}`
      },
      data: {
        title: props.movie.title,
        description: props.movie.overview,
        genre: props.movie.genres.map(g => g.name).join(' | '),
        score: props.movie.vote_average,
        poster: props.movie.poster_path,
        release_date: props.movie.release_date,
        runtime: props.movie.runtime,
        movie_num: props.movie.id
      }
    })
    window.alert('저장되었습니다')
  } catch (err) {
    console.error(err)
    window.alert('이미 저장되어있습니다')
  }
}

const deleteMovie = async () => {
  const store = useUserStore()
  try {
    await axios({
      method: 'delete',
      url: 'http://localhost:8000/like_movie/',
      headers: {
        Authorization: `Token ${store.token}`
      },
      data: {
        title: props.movie.title
      }
    })
    window.alert('삭제되었습니다')
  } catch (err) {
    console.error(err)
  }
}

const onCheck = function () {
  const store = useUserStore()
  axios({
    method: 'get',
    url: 'http://localhost:8000/like_movie/',
    headers: {
      Authorization: `Token ${store.token}`
    },
  })
  .then(res => {
    const likedMovies = res.data.movie_set || []
    const matchedMovie = likedMovies.find(movie => movie.title === props.movie.title)
    is_like.value = !!matchedMovie
    console.log(res.data, is_like.value)
  })
  .catch(err => {
    console.log(err, is_like.value)
  })
}

onMounted(() => {
  onCheck()
  checkScrollPosition()
  console.log(props.movie.data)
})
</script>

<style scoped>
.movie-detail {
  color: black;
  min-height: 100vh;
  border-radius: 0.25rem;
  padding: 2rem 1rem;
}

.image-wrapper {
  display: flex;
  justify-content: center;
  margin-bottom: 1.5rem;
  position: relative;
}

.movie-poster {
  max-width: 300px;
  width: 100%;
  height: auto;
  background-color: transparent;
  border-radius: 8px;
  box-shadow: none;
}

.movie-detail h3, .movie-detail h5 {
  color: #346ab9;
  user-select: none;
}

.movie-detail p {
  color: rgb(245, 239, 239);
  user-select: text;
  max-width: 700px;
  margin-left: auto;
  margin-right: auto;
  line-height: 1.6;
}

.trailer-btn {
  all: unset;
  width: 150px;
  height: 150px;
  cursor: pointer;
}

.trailer-btn:hover {
  transform: scale(1.1);
}

.like-icon {
  position: absolute;
  top: 1rem;
  right: 1rem;
  font-size: 2.5rem;
  color: #e74c3c;
  cursor: pointer;
  transition: transform 0.2s ease, color 0.3s ease;
}

.like-icon:hover {
  transform: scale(1.2);
}

.liked {
  color: #e74c3c;
}

.like-pop-enter-active,
.like-pop-leave-active {
  transition: transform 0.3s ease;
}

.like-pop-enter-from,
.like-pop-leave-to {
  transform: scale(0.6);
  opacity: 0;
}

ul {
  list-style: none;
  padding: 0;
  margin: 0;
}

.cast-wrapper {
  position: relative;
  display: flex;
  align-items: center;
}

.cast-slider {
  display: flex;
  overflow-x: auto;
  scroll-snap-type: x mandatory;
  gap: 1.5rem; /* 간격 넓힘 */
  padding: 1rem;
  scroll-behavior: smooth;
  -ms-overflow-style: none;
  scrollbar-width: none;
}

.cast-slider::-webkit-scrollbar {
  display: none;
}

.person-card {
  flex: 0 0 auto;
  width: 160px;
  scroll-snap-align: start;
  background: rgb(32, 22, 22);
  border-radius: 8px;
  box-shadow: 0 2px 4px rgba(0,0,0,0.1);
  text-align: center;
  padding: 0.5rem;
}

.person-card img {
  width: 100%;
  height: 205px;
  border-radius: 6px;
  margin: 0 0.3rem; /* 좌우 여백 추가 */
}

.person-card p {
  min-height: 3rem;
  line-height: 1.5rem;
  margin: 0.3rem 0;
  overflow: hidden;
  text-align: center;
}

.arrow {
  position: absolute;
  top: 50%;
  transform: translateY(-50%);
  z-index: 10;
  font-size: 1.8rem;
  background-color: transparent;
  border: none;
  cursor: pointer;
  color: #1E90FF;
  user-select: none;
  display: flex;
  align-items: center;
  gap: 0.2rem;
  padding: 0.3rem 0.5rem;
  border-radius: 50%;
  transition: color 0.3s ease;
}

.arrow:disabled,
.arrow[disabled],
.arrow[aria-disabled="true"] {
  color: #87CEFA;
  cursor: not-allowed;
}

.arrow.disabled-arrow {
  color: #87CEFA !important;
  cursor: not-allowed;
  opacity: 0.6;
}

.arrow.left {
  left: -2.5rem;
}
.arrow.right {
  right: -2.5rem;
}

.circle {
  font-size: 0.9rem;
  line-height: 1;
  color: #87CEFA;
}

.circle.filled {
  color: #1E90FF;
}

.noposter {
  width: 185px;
  height: 240px;
  margin: 0 0.3rem;
}
</style>
