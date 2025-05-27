import { ref, computed } from 'vue'
import { defineStore } from 'pinia'
import { useRouter } from 'vue-router'
import axios, { Axios } from 'axios'

export const useUserStore = defineStore('user', () => {
  const storedToken = localStorage.getItem('token')
  const token = ref(storedToken || '')

  const ACCOUNT_URL = 'http://127.0.0.1:8000/accounts'
  const isLogin = ref(false)
  const router = useRouter()
  const username = ref('')

  const deleteUser = function() {
    if (window.confirm('정말 회원탈퇴하시겠습니까?')) {
      axios({
        method: 'delete',
        url: `${ACCOUNT_URL}/delete_or_change_user/`,
        headers: {
          Authorization: `Token ${token.value}`
        }
      })
      .then(res => {
        window.alert('회원탈퇴 완료')
        router.push({ name: 'home' })
        logout()
      })
      .catch(err => {
        console.log(err)
        console.log('토큰:', token.value)
      })
    } else {
      router.push({ name: 'profile' })
    }
  }

  const signUp = function(payload){

    if (payload.age > 100) {
      window.alert('나이는 100세 이하로 입력해주세요')
      return
    }

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
      .catch(err => {
        console.log('회원가입 실패', err.response.data)
        const errorData = err.response.data
        const messages = Object.values(errorData).flat().join('\n')
        window.alert(messages)
      })
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
    .catch(err => {
      console.log('로그인 실패', err.response.data)
        const errorData = err.response.data
        const messages = Object.values(errorData).flat().join('\n')
        window.alert(messages)
    })
  }

  const logout = function () {
    token.value = ''
    localStorage.removeItem('token')
    isLogin.value = false
    console.log('로그아웃 완료')
  }

  const Update=function(payload){
      if (age.value > 100) {
        window.alert('나이는 100세 이하로 입력해주세요')
        return
      }

      if ((password1.value || password2.value) && password1.value !== password2.value) {
        window.alert('비밀번호가 일치하지 않습니다')
        return
      }

      axios({
        method: 'put',
        url: `${ACCOUNT_URL}/delete_or_change_user/`,
        headers: {
          Authorization: `Token ${token.value}`
        },
        data: payload
      })
        .then(res => {
          console.log('회원정보 수정 성공', res.data)
          window.alert('정보가 성공적으로 수정되었습니다.')

          if (password1.value) {
            logout()
            window.alert('비밀번호가 변경되어 다시 로그인해주세요')
            router.push({name:'login'})
          }
          router.push({name:'profile'})
        })
        .catch(err => {
          console.log('회원정보 수정 실패', err.response?.data)
          const errorData = err.response?.data
          const messages = Object.values(errorData).flat().join('\n')
          window.alert(messages)
        })
  }

  return {
    token, ACCOUNT_URL, isLogin, username,
    signUp, logIn, logout, deleteUser,Update
  }
},{persist:true})
