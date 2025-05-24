// src/stores/useMovieStore.js
import { defineStore } from 'pinia';
import { ref } from 'vue';

export const useMovieStore = defineStore('movie', () => {
  const recommendedMovies = ref([]);
  const selectedVideoId = ref('');
  const selectedVideoTitle = ref('');
  const showModal = ref(false);
  const error = ref('');

  const youtubeApiKey = import.meta.env.VITE_YOUTUBE_API_KEY;

  async function fetchMovies(keyword) {
    const url = `https://www.googleapis.com/youtube/v3/search?part=snippet&maxResults=15&q=${encodeURIComponent(keyword)} 예고편&type=video&key=${youtubeApiKey}`;

    try {
      const res = await fetch(url);
      const data = await res.json();

      if (!data.items?.length) {
        error.value = '예고편을 찾을 수 없습니다.';
        return;
      }

      recommendedMovies.value = data.items.map(item => ({
        title: item.snippet.title,
        videoId: item.id.videoId,
        thumbnail: item.snippet.thumbnails.medium.url,
      }));
    } catch (err) {
      error.value = `YouTube API 오류: ${err.message}`;
    }
  }

  function openModal(videoId, title) {
    selectedVideoId.value = videoId;
    selectedVideoTitle.value = title;
    showModal.value = true;
  }

  function closeModal() {
    selectedVideoId.value = '';
    selectedVideoTitle.value = '';
    showModal.value = false;
  }

  return {
    recommendedMovies,
    selectedVideoId,
    selectedVideoTitle,
    showModal,
    error,
    fetchMovies,
    openModal,
    closeModal,
  };
});
