<template>
  <div class="final-wrapper">
    <div class="final-content">
      <h1 class="closing-title">🎉 모두 수고하셨습니다 🙌</h1>
      <p class="closing-text">이상으로 발표를 마치겠습니다.<br />Q & A</p>
    </div>
  </div>
</template>

<script setup>
</script>

<style scoped>
.final-wrapper {
  height: 100vh;
  background: linear-gradient(to bottom, #000000, #1c1c1c);
  display: flex;
  justify-content: center;
  align-items: center;
  padding: 2rem;
  color: white;
}

.final-content {
  text-align: center;
  width: 90%;
  max-width: 1400px;
  padding: 4rem 3rem;
  background-color: rgba(255, 255, 255, 0.07);
  border: 3px solid #00bcd4;
  border-radius: 25px;
  box-shadow: 0 0 60px rgba(0, 188, 212, 0.6);
  animation: fadeIn 1.2s ease-out;
  transition: transform 0.3s ease-in-out;
}

.final-content:hover {
  transform: scale(1.02);
}

.closing-title {
  font-size: 4.5rem;
  color: #00e0ff;
  margin-bottom: 2rem;
  font-weight: 900;
  letter-spacing: 1.5px;
}

.closing-text {
  font-size: 2rem;
  color: #eeeeee;
  line-height: 2.2;
  font-weight: 500;
}

@keyframes fadeIn {
  0% {
    opacity: 0;
    transform: translateY(40px);
  }
  100% {
    opacity: 1;
    transform: translateY(0);
  }
}
</style>
