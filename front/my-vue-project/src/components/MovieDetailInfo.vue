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

    <div class="cast-wrapper">
      <button class="arrow left" @click="scrollLeft">&#10094;</button>
      <div class="cast-slider" ref="sliderRef">
        <div class="person-card" v-if="director">
          <img v-if="director.profile_path" :src="`https://image.tmdb.org/t/p/w185${director.profile_path}`" alt="감독 이미지">
          <p><strong>감독</strong></p>
          <p>{{ director.original_name }}</p>
          <p>{{ director.name }}</p>
        </div>
        <div class="person-card" v-for="cast in casts" :key="cast.cast_id">
          <img v-if="cast.profile_path" :src="`https://image.tmdb.org/t/p/w185${cast.profile_path}`" alt="출연진 이미지">
          <p><strong>{{ cast.character }}</strong></p>
          <p>{{ cast.original_name }}</p>
          <p>{{ cast.name }}</p>
        </div>
      </div>
      <button class="arrow right" @click="scrollRight">&#10095;</button>
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
const sliderRef = ref(null)
const props = defineProps({
  movie: Object
})

const casts = computed(() => {
  return (props.movie.credits?.cast || []).slice(0, 10)
})

const director = computed(() => {
  return props.movie.credits?.crew?.find(person => person.job === 'Director') || null
})

const scrollLeft = () => {
  sliderRef.value.scrollBy({ left: -200, behavior: 'smooth' })
}
const scrollRight = () => {
  sliderRef.value.scrollBy({ left: 200, behavior: 'smooth' })
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
onMounted(()=>{
  onCheck()
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
  color: #0d6efd;
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
  width: 250px;
  height: 64px;
  cursor: pointer;
  filter: drop-shadow(0 0 4px rgba(255, 0, 0, 0.7));
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
  gap: 1rem;
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
  height: auto;
  border-radius: 6px;
}

.arrow {
  position: absolute;
  top: 50%;
  transform: translateY(-50%);
  z-index: 10;
  font-size: 2rem;
  background-color: rgba(255,255,255,0.8);
  border: none;
  padding: 0.5rem 0.8rem;
  cursor: pointer;
  border-radius: 50%;
  transition: background-color 0.2s ease;
}
.arrow:hover {
  background-color: rgba(200, 200, 200, 0.9);
}
.arrow.left {
  left: -2.5rem;
}
.arrow.right {
  right: -2.5rem;
}
</style>


