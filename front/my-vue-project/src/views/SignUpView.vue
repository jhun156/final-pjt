<template>
  <div class="signup-container">
    <div class="signup-card">
      <h2 class="title">회원가입</h2>
      <form @submit.prevent="onSignUp">
        <div class="form-group">
          <label for="nickname">닉네임</label>
          <input type="text" id="nickname" v-model.trim="nickname" required />
        </div>
        <div class="form-group">
          <label for="username">아이디</label>
          <input type="text" id="username" v-model.trim="username" required />
        </div>
        <div class="form-group">
          <label for="password1">비밀번호</label>
          <input type="password" id="password1" v-model.trim="password1" required />
        </div>
        <div class="form-group">
          <label for="password2">비밀번호 확인</label>
          <input type="password" id="password2" v-model.trim="password2" required />
        </div>
        <div class="form-group">
          <label for="gender">성별</label>
          <select v-model.trim="gender" id="gender">
            <option disabled value="">성별 선택</option>
            <option value="MEN">MEN</option>
            <option value="WOMEN">WOMEN</option>
            <option value="SECRET">SECRET</option>
          </select>
        </div>
        <div class="form-group">
          <label>좋아하는 장르</label>
          <label><input type="checkbox" value="드라마 | 로맨스" v-model="genre"> 드라마/로맨스</label>
          <label><input type="checkbox" value="판타지" v-model="genre"> 판타지</label>
          <label><input type="checkbox" value="코미디" v-model="genre"> 코미디</label>
          <label><input type="checkbox" value="범죄 | 스릴러" v-model="genre"> 범죄/스릴러</label>
          <label><input type="checkbox" value="액션" v-model="genre"> 액션</label>
        </div>
        <div class="form-group">
          <label for="email">이메일</label>
          <input type="email" id="email" v-model.trim="email" required />
        </div>
        <div class="form-group">
          <label for="age">나이</label>
          <input type="number" id="age" v-model.trim="age" required />
        </div>
        <button type="submit" class="submit-btn">가입하기</button>
      </form>
    </div>
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
const gender=ref('')
const age=ref(0)
const nickname=ref('')
const genre=ref([])

const onSignUp = () => {
  const payload = {
    username: username.value,
    password1: password1.value,
    password2: password2.value,
    email: email.value,
    gender:gender.value,
    age:age.value,
    nickname:nickname.value,
    genre: genre.value.join(' | ') 
  }
  userStore.signUp(payload)
}
</script>

<style scoped>
.signup-container {
  display: flex;
  justify-content: center;
  align-items: center;
  min-height: 80vh;
  background-color:black;
}

.signup-card {
  background: #fff;
  padding: 2rem 2.5rem;
  border-radius: 12px;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.08);
  width: 100%;
  max-width: 400px;
}

.title {
  text-align: center;
  margin-bottom: 1.5rem;
  font-size: 1.8rem;
  color: #2c3e50;
}

.form-group {
  margin-bottom: 1.2rem;
  display: flex;
  flex-direction: column;
}

label {
  margin-bottom: 0.5rem;
  font-weight: 600;
  color: #34495e;
}

input {
  padding: 0.6rem;
  font-size: 1rem;
  border: 1px solid #ccc;
  border-radius: 8px;
  transition: border-color 0.3s ease;
}

input:focus {
  border-color: #6c5ce7;
  outline: none;
}

.submit-btn {
  width: 100%;
  background-color: #6c5ce7;
  color: #fff;
  padding: 0.8rem;
  border: none;
  border-radius: 8px;
  font-size: 1rem;
  font-weight: 600;
  cursor: pointer;
  transition: background-color 0.3s ease;
}

.submit-btn:hover {
  background-color: #5a4bd3;
}

select {
  padding: 0.6rem;
  font-size: 1rem;
  border: 1px solid #ccc;
  border-radius: 8px;
  transition: border-color 0.3s ease;
  background-color: #fff;
  color: #2c3e50;
  appearance: none; /* 브라우저 기본 화살표 제거 */
  -moz-appearance: none;
  -webkit-appearance: none;
  background-image: url("data:image/svg+xml;charset=US-ASCII,%3Csvg xmlns='http://www.w3.org/2000/svg' width='12' height='12' viewBox='0 0 24 24'%3E%3Cpath fill='%236c5ce7' d='M7 10l5 5 5-5z'/%3E%3C/svg%3E");
  background-repeat: no-repeat;
  background-position: right 0.8rem center;
  background-size: 1rem;
}
select:focus {
  border-color: #6c5ce7;
  outline: none;
}
</style>
