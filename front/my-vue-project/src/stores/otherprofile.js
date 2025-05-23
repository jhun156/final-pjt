import { ref, computed } from 'vue'
import { defineStore } from 'pinia'
import axios from 'axios'
import { useUserStore } from './auth.js'

export const useOtherProfileStore = defineStore('otherprofile', () => {

  const USERINFO_URL = 'http://127.0.0.1:8000/userinfo/'
  const FOLLOW_URL = 'http://127.0.0.1:8000/'

  const movies = ref([])
  const user = ref({})
  const userStore = useUserStore()
  const followers = ref('')
  const followings = ref('')

  const userInfo = function (userId) {
    axios({
      method: 'get',
      url: `${USERINFO_URL}${userId}/`,
      headers: {
        Authorization: `Token ${userStore.token}`
      }
    })
      .then((res) => {
        user.value = res.data.user
        movies.value = res.data.movies
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
          .catch(err => console.log(err))
      })
      .catch((err) => {
        console.log(err)
      })
  }
  
  return {
    USERINFO_URL, movies, user, followers, followings,
    userInfo
  }
},{persist: true})
