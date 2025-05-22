<template>
  <div class="modal-backdrop" @click.self="close">
    <div class="modal-content" role="dialog" aria-modal="true">
      <div class="modal-header">
        <h3 class="video-title">{{ movie.title }}</h3>
        <button class="close-btn" @click="close" aria-label="Close">X</button>
      </div>
      <iframe
        v-if="store.youtubeitem.length > 0 && store.youtubeitem[0].id?.videoId"
        :src="`https://www.youtube.com/embed/${encodeURIComponent(store.youtubeitem[0].id.videoId)}?autoplay=1`"
        frameborder="0"
        allow="autoplay; encrypted-media"
        allowfullscreen
      ></iframe>
    </div>
  </div>
</template>

<script setup>
  import { ref, onMounted } from 'vue'
  import { useYoutubeStore } from '@/stores/youtube.js'
  const store = useYoutubeStore()

  const props = defineProps({
    movie:Object
  })

  import { watch } from 'vue'

  watch(
    () => props.movie,
    (newMovie) => {
      if (newMovie && newMovie.title) {
        store.searchTrailerYoutube(1, newMovie.title)
      }
    },
    { immediate: true }
  )


  const emit = defineEmits(['close'])

  function close() {
    emit('close')
  }
</script>

<style scoped>
.modal-backdrop {
  position: fixed;
  top: 0; left: 0;
  width: 100vw;
  height: 100vh;
  background: rgba(0,0,0,0.3); /* 약간 연한 어둡게 */
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 999;
}

.modal-content {
  background: white;
  border-radius: 10px;
  box-shadow: 0 4px 16px rgba(0,0,0,0.15); /* 은은한 그림자 */
  width: 750px;
  overflow: hidden;
  display: flex;
  flex-direction: column;
}

.modal-header {
  background: white;
  color: black;
  padding: 0.75rem 1rem;
  display: flex;
  justify-content: space-between;
  align-items: center;
  font-weight: bold;
  border-bottom: 1px solid #ddd;
}

.video-title {
  margin: 0;
  font-size: 1.25rem;
  user-select: none;
}

.close-btn {
  background: transparent;
  border: none;
  color: #555;
  font-size: 1.25rem;
  cursor: pointer;
  transition: color 0.2s ease;
}

.close-btn:hover {
  color: #000;
}

iframe {
  width: 100%;
  height: 390px; /* 16:9 비율 조금 키운 높이 */
  border: none;
  display: block;
}

</style>
