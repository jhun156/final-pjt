<template>
  <div class="modal-backdrop" @click.self="closeModal">
    <div class="modal-content" role="dialog" aria-modal="true">
      <div class="modal-header">
        <h3 class="video-title">{{ videotitle }}</h3>
        <button class="close-btn" @click="closeModal" aria-label="Close">X</button>
      </div>
      <iframe
        :src="`https://www.youtube.com/embed/${videoId}?autoplay=1`"
        frameborder="0"
        allow="autoplay; encrypted-media"
        allowfullscreen
      ></iframe>
    </div>
  </div>
</template>

<script setup>


const props = defineProps({
  videoId: String,
  videotitle: String
});

const emit = defineEmits(['close']);

function closeModal() {
  emit('close');
}
</script>

<style scoped>

.modal-backdrop {
  position: fixed;
  top: 0;
  left: 0;
  width: 100vw;
  height: 100vh;
  background: rgba(0, 0, 0, 0.5); /* 좀 더 짙은 배경 */
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 1000; /* 다른 요소보다 위에 표시 */
}

.modal-content {
  background: white;
  border-radius: 8px;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.2);
  width: 80%;
  max-width: 700px;
  overflow: hidden;
  display: flex;
  flex-direction: column;
}

.modal-header {
  background: #f8f9fa;
  color: #333;
  padding: 1rem;
  display: flex;
  justify-content: space-between;
  align-items: center;
  border-bottom: 1px solid #ddd;
}

.video-title {
  margin: 0;
  font-size: 1.1rem;
  font-weight: bold;
}

.close-btn {
  background: none;
  border: none;
  color: #6c757d;
  font-size: 1.5rem;
  cursor: pointer;
  opacity: 0.7;
  transition: opacity 0.15s ease-in-out;
}

.close-btn:hover {
  opacity: 1;
}

iframe {
  width: 100%;
  height: 400px; /* 적절한 높이 설정 */
  border: none;
}
</style>