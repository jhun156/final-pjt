import { ref, computed } from 'vue'
import { defineStore } from 'pinia'
import axios from 'axios'
import { useUserStore } from './auth.js'

export const useOtherProfileStore = defineStore('profile', () => {

  const USERINFO_URL = 'http://127.0.0.1:8000/userinfo/'
  
  const movies = ref([])
  const user = ref({})
  const userStore = useUserStore()

  const userInfo = function (userId) {
    axios({
      method: 'get',
      url: `${USERINFO_URL}${userId}/`,
      headers: {
        Authorization: `Token ${userStore.token}`
      }
    })
      .then((res) => {
        user.value = { ...res.data.user }    // 새로운 객체로 덮어쓰기
        movies.value = [...res.data.movies]  // 배열도 새 배열로 덮어쓰기
        console.log('데이터 로드 성공')
      })
      .catch((err) => {
        console.log(err)
      })
  }
  
  return {
    USERINFO_URL, movies, user,
    userInfo
  }
},{persist: true})
