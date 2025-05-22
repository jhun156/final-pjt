<template>
  <div class="comments-section">
    <form @submit="submitComment">
      <label for="subtitle">소제목</label><br>
      <input type="text" name="subtitle" id="subtitle" v-model="subtitle"><br>
      <label for="content">댓글 작성</label><br>
      <textarea name="content" id="content" v-model="content"></textarea>
      <button type="submit">등록</button>
    </form>

    <div v-if="filteredComments.length">
      <h4>댓글 목록</h4>
      <div v-for="comment in filteredComments" :key="comment.id" class="comment">
        <p>{{ comment.subtitle }} : {{ comment.content }}</p>
        <small>작성자: {{ comment.username }}</small>
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

const profileStore=useProfileStore()

const props = defineProps({
  movie: Object
})

const store = useUserStore()
const comments = ref([])
const subtitle=ref('')
const content=ref('')
const user = profileStore.user

const submitComment=function(){
  axios({
    method:'POST',
    url: 'http://localhost:8000/movie/comments/',
    headers: {
      Authorization: `Token ${store.token}`
    },
    data:{
      movie:props.movie.title,
      subtitle:subtitle.value,
      content:content.value,
      username: user.username
    }
  })
}

onMounted(() => {
  axios({
    method: 'get',
    url: 'http://localhost:8000/movie/comments/',
    headers: {
      Authorization: `Token ${store.token}`
    },
  })
    .then(res => {
      console.log(res.data)
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
.comment {
  border-bottom: 1px solid #ddd;
  padding: 0.5rem 0;
}
</style>
