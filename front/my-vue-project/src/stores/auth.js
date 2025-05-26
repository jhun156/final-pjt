import { ref, computed } from 'vue'
import { defineStore } from 'pinia'
import { useRouter } from 'vue-router'
import axios from 'axios'

export const useUserStore = defineStore('user', () => {

  const storedToken = localStorage.getItem('token')
  const token = ref(storedToken || '')

  const ACCOUNT_URL = 'http://127.0.0.1:8000/accounts'
  const isLogin = ref(false)
  const router = useRouter()
  const username = ref('')

  const signUp = function(payload){
    axios({
      method:'post',
      url:`${ACCOUNT_URL}/signup/`,
      data:{
        username: payload.username,
        password1: payload.password1,
        password2: payload.password2,
        email: payload.email,
        gender:payload.gender,
        age:payload.age,
        nickname:payload.nickname,
        genre:payload.genre
      }
    })
      .then(res => {
        console.log('회원가입 성공', res.data)
        window.alert('회원가입 성공, 로그인하세요')
        router.push({ name: 'login' })
      })
      .catch(err => console.log(err))
  }

  const logIn = function(payload){
    axios({
      method:'post',
      url:`${ACCOUNT_URL}/login/`,
      data:{
        username: payload.username,
        password: payload.password
      }
    })
    .then(res=>{
      console.log('로그인 성공', res.data)
      token.value = res.data.key
      localStorage.setItem('token', res.data.key)
      window.alert('로그인 성공')
      isLogin.value = true
      username.value = payload.username
      router.push({ name: 'home' })
    })
    .catch(err => console.log(err))
  }

  const logout = function () {
    token.value = ''
    localStorage.removeItem('token')
    isLogin.value = false
    console.log('로그아웃 완료')
  }

  return {
    token, ACCOUNT_URL, isLogin, username,
    signUp, logIn, logout
  }
},{persist:true})
