<template>
  <div>
    <h1>회원가입 페이지</h1>
    <form @submit.prevent="onSignUp">
      <div>
        <label for="username">username : </label>
        <input type="text" id="username" v-model.trim="username"/>
      </div>
      <div>
        <label for="password1">Password : </label>
        <input type="password" id="password1" v-model.trim="password1"/>
      </div>
      <div>
        <label for="password2">Password Confirm : </label>
        <input type="password" id="password2" v-model.trim="password2"/>
      </div>
      <div>
        <label for="email">email : </label>
        <input type="text" id="email" v-model.trim="email"/>
      </div>
      <button type="submit">제출</button>
    </form>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import { useUserStore } from "@/stores/auth.js"

const userStore = useUserStore()
const username = ref('')
const password1 = ref('')
const password2 = ref('')
const email = ref('')

const onSignUp = () => {
  const payload = {
    username: username.value,
    password1: password1.value,
    password2: password2.value,
    email: email.value
  }
  userStore.signUp(payload);
}
</script>

<style scoped>

</style>