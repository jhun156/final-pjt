<template>
  <div class="edit-container">
    <div class="edit-card">
      <h2 class="title">회원정보 수정</h2>
      <form @submit.prevent="onUpdate">
        <div class="form-group">
          <label for="password1">새 비밀번호</label>
          <input type="password" id="password1" v-model.trim="password1" placeholder="변경하지 않을거면 비워두세요" />
        </div>
        <div class="form-group">
          <label for="password2">새 비밀번호 확인</label>
          <input type="password" id="password2" v-model.trim="password2" placeholder="비밀번호 확인" />
        </div>
        <div class="form-group">
          <label for="age">나이</label>
          <input type="number" id="age" v-model.number="age" required />
        </div>
        <div class="form-group">
          <label for="gender">성별</label>
          <select v-model="gender" id="gender">
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
        <button type="submit" class="submit-btn">정보 수정</button>
      </form>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import axios from 'axios'
import { useUserStore } from '@/stores/auth.js'

const userStore = useUserStore()

const age = ref(0)
const gender = ref('')
const genre = ref([])
const password1 = ref('')
const password2 = ref('')

const onUpdate = () => {
  const payload = {}

  if (age.value) {
    payload.age = age.value
  }
  if (gender.value) {
    payload.gender = gender.value
  }
  if (genre.value && genre.value.length > 0) {
    payload.genre = genre.value.join(' | ')
  }

  if (password1.value && password2.value) {
    payload.password1 = password1.value
    payload.password2 = password2.value
  }
  userStore.Update(payload)
}
</script>

<style scoped>
.edit-container {
  display: flex;
  justify-content: center;
  align-items: center;
  min-height: 80vh;
  background-color: black;
}

.edit-card {
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

input,
select {
  padding: 0.6rem;
  font-size: 1rem;
  border: 1px solid #ccc;
  border-radius: 8px;
  transition: border-color 0.3s ease;
}

input:focus,
select:focus {
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
</style>
