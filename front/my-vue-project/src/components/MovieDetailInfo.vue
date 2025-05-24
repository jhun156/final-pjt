<template>
  <div class="container py-4 movie-detail">
    <div class="image-wrapper">
      <img
        :src="'https://image.tmdb.org/t/p/w500' + movie.poster_path"
        alt="상세 이미지"
        class="movie-poster"
      />
      <transition name="fade-scale" mode="out-in">
      <img
        :key="is_like"
        :src="is_like ? '/src/assets/ssafyLogo.png' : '/src/assets/like.png'"
        alt="좋아요 상태"
        class="like-image"
        @click="toggleLike"
      />
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
import { ref } from 'vue'
import axios from 'axios'
import { useUserStore } from '@/stores/auth.js'

const props = defineProps({ movie: Object })
const is_like = ref(false)

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
    await axios.post('http://localhost:8000/movie/', {
      title: props.movie.title,
      description: props.movie.overview,
      genre: props.movie.genres.map(g => g.name).join(' | '),
      score: props.movie.vote_average,
      poster: props.movie.poster_path,
      release_date: props.movie.release_date,
      runtime: props.movie.runtime
    }, {
      headers: {
        Authorization: `Token ${store.token}`
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
    await axios.delete('http://localhost:8000/like_movie/', {
      headers: { Authorization: `Token ${store.token}` },
      data: { title: props.movie.title }
    })
    window.alert('삭제되었습니다')
  } catch (err) {
    console.error(err)
  }
}
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
  justify-content: center; /* 이미지 가운데 정렬 */
  margin-bottom: 1.5rem;
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
</style>


