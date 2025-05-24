import { ref, computed } from 'vue'
import { defineStore } from 'pinia'
import axios from 'axios'
import { useUserStore } from './auth.js'

export const useOtherProfileStore = defineStore('otherprofile', () => {

  const URL = 'http://127.0.0.1:8000'

  const userStore = useUserStore()
  
  const followers = ref('')
  const followings = ref('')
  const followed = ref(null)
  
  const movies = ref([])
  const user = ref({})

  const userInfo = function (userId) {
    axios({
      method: 'get',
      url: `${URL}/userinfo/${userId}/`,
      headers: {
        Authorization: `Token ${userStore.token}`
      }
    })
      .then((res) => {
        console.log('데이터 로드 성공', res.data)
        user.value = res.data.user
        movies.value = res.data.movies
      })
      .catch((err) => {
        console.log(err)
      })
  }

  const follow = function (userId) {
    axios({
      method: 'post',
      url: `${URL}/${userId}/follow/`,
      headers: {
        Authorization: `Token ${userStore.token}`
      }
    })
      .then((res) => {
        console.log('팔로우 토글 성공', res.data)
        followed.value = res.data.followed
      })
      .catch((err) => {
        console.log(err)
      })
  }

  const followStatus = function (userId) {
    axios({
      method: 'get',
      url: `${URL}/${userId}/follow/`,
      headers: {
        Authorization: `Token ${userStore.token}`
      }
    })
      .then((res) => {
        console.log('팔로우 데이터 로드 성공', res.data)
        followed.value = res.data.followed
        followers.value = res.data.followers_count
        followings.value = res.data.followings_count
      })
      .catch((err) => {
        console.log(err)
      })
  }
 
  return {
    movies, user, followers, followings, followed,
    userInfo, follow, followStatus
  }
},{persist: true})
