import { ref, computed } from 'vue'
import { defineStore } from 'pinia'
import axios from 'axios'
import { useUserStore } from './auth.js'

export const useProfileStore = defineStore('profile', () => {

  const PROFILE_URL = 'http://127.0.0.1:8000/movie/'
  const USERINFO_URL = 'http://127.0.0.1:8000/userinfo/'
  const movies = ref([])
  const user = ref({})
  const userStore = useUserStore()

  const movieList = function () {
    axios({
      method: 'get',
      url: `${PROFILE_URL}`,
      headers: {
        Authorization: `Token ${userStore.token}`
      }
    })
      .then((res) => {
        movies.value = res.data
      })
      .catch((err) => {
        console.log(err.response.data)
      })
  }

  const userInfo = function () {
    axios({
      method: 'get',
      url: `${USERINFO_URL}`,
      headers: {
        Authorization: `Token ${userStore.token}`
      }
    })
      .then((res) => {
        user.value = res.data
      })
      .catch((err) => {
        console.log(err)
      })
  }
  
  return {
    PROFILE_URL, USERINFO_URL, movies, user,
    movieList, userInfo
  }
},{persist:true})
