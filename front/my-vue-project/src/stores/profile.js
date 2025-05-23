import { ref } from 'vue'
import { defineStore } from 'pinia'
import axios from 'axios'
import { useUserStore } from './auth.js'

export const useProfileStore = defineStore('profile', () => {

  const USERINFO_URL = 'http://127.0.0.1:8000/userinfo/'
  const FOLLOW_URL = 'http://127.0.0.1:8000/'
  const movies = ref([])
  const user = ref({})
  const userStore = useUserStore()
  const followers = ref('')
  const followings = ref('')

  const userInfo = function () {
    axios({
      method: 'get',
      url: `${USERINFO_URL}`,
      headers: {
        Authorization: `Token ${userStore.token}`
      }
    })
    .then((res) => {
      user.value = res.data.user
      movies.value = res.data.movies
      console.log(res.data.user)
    })
    .catch((err) => {
      console.log('UserInfo 에러:', err)
    })
  }

  const followInfo = function () {
    axios({
      method: 'get',
      url: `${FOLLOW_URL}${user.value.id}/follow/`,
      headers: {
        Authorization: `Token ${userStore.token}`
      }
    })
    .then(res => {
      followers.value = res.data.followers_count
      followings.value = res.data.followings_count
    })
    .catch(err => console.log('Follow 정보 에러:', err))
  }

  return {
    movies, user, followers, followings,
    userInfo, followInfo
  }
},{persist:true})
