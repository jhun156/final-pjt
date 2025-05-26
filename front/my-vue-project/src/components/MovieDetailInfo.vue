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
    <h3 class="text-center mb-3 text-primary fw-bold">{{ movie.title }} 상세 페이지</h3>
    <p class="text-center mb-1"><strong>개봉일:</strong> {{ movie.release_date }}</p>
    <p class="text-center mb-1"><strong>러닝타임:</strong> {{ movie.runtime }}분</p>
    <p class="text-center mb-3"><strong>TMDB 평점:</strong> {{ movie.vote_average }}</p>

    <div v-if="movie.genres && movie.genres.length >= 2" class="text-center mb-3">
      <h5 class="fw-semibold">장르</h5>
      <p>{{ movie.genres.map(g => g.name).join(' | ') }}</p>
    </div>

    <h5 class="fw-semibold text-center mb-2">줄거리</h5>
    <p class="mb-4">{{ movie.overview }}</p>

    <h5 v-show="casts.length > 0" class="fw-semibold text-center mb-2">감독 / 출연</h5>
      <div v-if="director">
        <img 
          v-if="director.profile_path" 
          :src="`https://image.tmdb.org/t/p/w185${director.profile_path}`" 
          alt="감독 이미지"
        >
        <p>감독 Director</p>
        <p>감독명 : {{ director.original_name }} / 한글 이름 : {{ director.name }}</p>
      </div>
    
      <div v-if="casts.length > 0">
        <ul>
          <li v-for="cast in casts" :key="cast.cast_id">
            <img 
              v-if="cast.profile_path" 
              :src="`https://image.tmdb.org/t/p/w185${cast.profile_path}`" 
              alt="출연진 이미지"
            >
            <p>배역 : {{ cast.character }}</p>
            <p>배우명 : {{ cast.original_name }} / 한글 이름 : {{ cast.name }}</p>
          </li>
        </ul>
      </div>

    <h5 class="fw-semibold text-center mb-3">공식 예고편</h5>
    <div class="d-flex justify-content-center mb-3">
      <img 
        src="@/assets/youtubebutton.png" 
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
const props = defineProps({
  movie: Object
})

const casts = computed(() => {
  return (props.movie.credits?.cast || []).slice(0, 5)
})

const director = computed(() => {
  return props.movie.credits?.crew?.find(person => person.job === 'Director') || null
})

console.log(casts)
console.log(director)

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
        runtime: props.movie.runtime
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
    const likedMovies = res.data.movie_set || []  // ✅ 변수 이름 통일
    const matchedMovie = likedMovies.find(movie => movie.title === props.movie.title)
    is_like.value = !!matchedMovie
    console.log(res.data, is_like.value)
  })
  .catch(err => {
    console.log(err, is_like.value)
  })
}
onMounted(()=>{
  onCheck()
})

</script>

<style scoped>
.movie-detail {
  /* background-color: #121212; */
  color: black;
  min-height: 100vh;
  border-radius: 0.25rem;
  padding: 2rem 1rem;
}

.image-wrapper {
  display: flex;
  justify-content: center;
  margin-bottom: 1.5rem;

  position: relative; /* ✅ 추가: 하트 아이콘 배치 기준 */
}


.movie-poster {
  max-width: 300px; /* 크기 줄임 */
  width: 100%;
  height: auto;
  background-color: transparent; /* 검은 배경 없애기 */
  border-radius: 8px;
  box-shadow: none; /* 혹시 그림자 있으면 제거 */
}

.movie-detail h3, .movie-detail h5 {
  color: #0d6efd; /* 부트스트랩 기본 파란색 */
  user-select: none;
}

.movie-detail p {
  color: black;
  user-select: text;
  max-width: 700px;
  margin-left: auto;
  margin-right: auto;
  line-height: 1.6;
}

.trailer-btn {
  all: unset;
  width: 64px;
  height: 64px;
  cursor: pointer;
  filter: drop-shadow(0 0 4px rgba(255, 0, 0, 0.7));
}

.trailer-btn:hover {
  transform: scale(1.1);
}
.like-icon {
  position: absolute; /* ✅ 추가 */
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
  padding: 0;  /* ← 왼쪽 들여쓰기도 없애고 싶다면 이거도!! */
  margin: 0;
}

</style>


