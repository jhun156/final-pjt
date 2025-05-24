import { ref } from 'vue'
import { defineStore } from 'pinia'
import axios from 'axios'
import { useUserStore } from './auth.js'

export const useOtherProfileStore = defineStore('otherprofile', () => {
  const URL = 'http://127.0.0.1:8000'
  const userStore = useUserStore()

  const user = ref({})
  const movies = ref([])
  const followers = ref(0)
  const followings = ref(0)
  const followed = ref(false)

  const userInfo = (userId) => {
  axios({
    method: 'get',
    url: `${URL}/userinfo/${userId}/`,
    headers: {
      Authorization: `Token ${userStore.token}`
    }
  })
  .then((res) => {
    user.value = { ...res.data.user }
    movies.value = [...res.data.movies]
  })
  .catch((err) => {
    console.error(err)
  })
}

const followStatus = (userId) => {
  axios({
    method: 'get',
    url: `${URL}/${userId}/follow/`,
    headers: {
      Authorization: `Token ${userStore.token}`
    }
  })
  .then((res) => {
    followed.value = res.data.followed
    followers.value = res.data.followers_count
    followings.value = res.data.followings_count
  })
  .catch((err) => {
    console.error(err)
  })
}

const follow = (userId) => {
  axios({
    method: 'post',
    url: `${URL}/${userId}/follow/`,
    headers: {
      Authorization: `Token ${userStore.token}`
    }
  })
  .then((res) => {
    followed.value = res.data.followed
    return axios({
      method: 'get',
      url: `${URL}/${userId}/follow/`,
      headers: {
        Authorization: `Token ${userStore.token}`
      }
    })
  })
  .then((res) => {
    followed.value = res.data.followed
    followers.value = res.data.followers_count
    followings.value = res.data.followings_count
    return axios({
      method: 'get',
      url: `${URL}/userinfo/${userId}/`,
      headers: {
        Authorization: `Token ${userStore.token}`
      }
    })
  })
  .then((res) => {
    user.value = { ...res.data.user }
    movies.value = [...res.data.movies]
  })
  .catch((err) => {
    console.error(err)
  })
}

  return {
    user, movies, followers, followings, followed,
    userInfo, followStatus, follow
  }
}, {
  persist: true // 유지
})
