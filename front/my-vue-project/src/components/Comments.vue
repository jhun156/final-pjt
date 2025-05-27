<template>
  <div class="comments-section">
    <form @submit.prevent="submitComment">
      <label for="subtitle">댓글 제목</label>
      <input type="text" name="subtitle" id="subtitle" v-model="subtitle" />

      <label for="content">댓글 내용</label>
      <textarea name="content" id="content" v-model="content" />

      <button type="submit">등록</button>
    </form>

    <div v-if="filteredComments.length">
      <h4>댓글 목록</h4>
      <div
        v-for="comment in filteredComments"
        :key="comment.id"
        class="comment"
      >
        <div class="comment-header">
          <div class="comment-title">{{ comment.subtitle }}</div>
          <div class="comment-user">작성자: {{ comment.nickname }}</div>
        </div>
        <div class="comment-content">{{ comment.content }}</div>
        <div class="comment-meta">
          <button
            v-show="username !== comment.username"
            @click.prevent="goOtherProfile(comment.user)"
          >
            프로필
          </button>
          <button
            v-show="username === comment.username"
            @click="goDelete(comment.id)"
            style="color: white; background-color: red; border: none; padding: 0.375rem 0.75rem; border-radius: 0.25rem; cursor: pointer;"          >
            삭제
          </button>
        </div>
      </div>
    </div>
    <p v-else>아직 댓글이 없습니다.</p>
  </div>
</template>

<script setup>
import { ref, onMounted, computed } from 'vue'
import axios from 'axios'
import { useUserStore } from '@/stores/auth'
import { useProfileStore } from '@/stores/profile'
import { useRouter } from 'vue-router'

const profileStore = useProfileStore()
const router = useRouter()

const props = defineProps({
  movie: Object
})

const store = useUserStore()
const username = store.username
const comments = ref([])
const subtitle = ref('')
const content = ref('')
const user = profileStore.user

const submitComment = function () {
  axios({
    method: 'POST',
    url: 'http://localhost:8000/movie/comments/',
    headers: {
      Authorization: `Token ${store.token}`
    },
    data: {
      movie: props.movie.title,
      subtitle: subtitle.value,
      content: content.value,
      username: user.username,
      nickname: user.nickname
    }
  })
    .then(res => {
      comments.value.push(res.data)
      subtitle.value = ''
      content.value = ''
    })
    .catch(err => console.log(err))
}

const goOtherProfile = function (userId) {
  router.push({ name: 'otherprofile', params: { userid: userId } })
}

const goDelete = function(commentId) {
  const token = localStorage.getItem('token')

  axios({
    method: 'delete',
    url: `http://127.0.0.1:8000/movie/comments/${commentId}/`,
    headers: {
      Authorization: `Token ${token}`
    }
  })
  .then(res => {
    comments.value = comments.value.filter(comment => comment.id !== commentId)
    window.alert('댓글이 삭제되었습니다.')
  })
  .catch(err => {
    console.log('댓글 삭제 실패', err.response)
  })
}

onMounted(() => {
  axios({
    method: 'get',
    url: 'http://localhost:8000/movie/comments/',
    headers: {
      Authorization: `Token ${store.token}`
    }
  })
    .then(res => {
      comments.value = res.data
    })
    .catch(err => {
      console.log(err)
    })
})

const filteredComments = computed(() =>
  comments.value.filter(comment => comment.movie === props.movie.title)
)
</script>

<style scoped>
.comments-section {
  max-width: 600px;
  margin: 2rem auto;
  padding: 1.5rem;
  border: 1px solid #e0e0e0;
  border-radius: 12px;
  background-color: #fafafa;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.05);
  font-family: 'Noto Sans KR', sans-serif;
}

.comments-section h4 {
  margin-top: 2rem;
  margin-bottom: 1rem;
  font-size: 1.2rem;
  color: #333;
}

form {
  display: flex;
  flex-direction: column;
  gap: 0.75rem;
}

label {
  font-weight: 600;
  margin-bottom: 0.2rem;
}

input[type='text'],
textarea {
  width: 100%;
  padding: 0.6rem;
  font-size: 0.95rem;
  border: 1px solid #ccc;
  border-radius: 8px;
  resize: vertical;
  background-color: #fff;
}

textarea {
  min-height: 80px;
}

button[type='submit'] {
  width: 100px;
  align-self: flex-end;
  padding: 0.5rem 1rem;
  background-color: #7c4dff;
  color: white;
  font-weight: bold;
  border: none;
  border-radius: 8px;
  cursor: pointer;
  transition: background-color 0.3s ease;
}

button[type='submit']:hover {
  background-color: #651fff;
}

.comment {
  padding: 1.2rem;
  margin-bottom: 1.5rem;
  background-color: #fff;
  border: 1px solid #ddd;
  border-radius: 12px;
  box-shadow: 0 1px 4px rgba(0, 0, 0, 0.06);
}

.comment-header {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  margin-bottom: 0.8rem;
  padding-bottom: 0.6rem;
  border-bottom: 1px solid #ccc; 
}


.comment-title {
  font-size: 1.1rem;
  font-weight: bold;
  color: #2c3e50;
}

.comment-user {
  font-size: 0.9rem;
  color: #666;
  white-space: nowrap;
}

.comment-content {
  font-size: 1rem;
  color: #444;
  line-height: 1.6;
  margin-bottom: 1rem;
  padding-left: 0.2rem;
}

.comment-meta {
  text-align: right;
}

.comment-meta button {
  padding: 0.4rem 0.7rem;
  background-color: #e0e0e0;
  border: none;
  border-radius: 6px;
  font-size: 0.85rem;
  cursor: pointer;
  transition: background-color 0.3s ease;
}

.comment-meta button:hover {
  background-color: #cfcfcf;
}

p {
  text-align: center;
  color: #777;
  font-size: 0.95rem;
}
</style>
