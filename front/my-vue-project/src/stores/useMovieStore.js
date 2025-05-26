// src/stores/useMovieStore.js
import { defineStore } from 'pinia';
import { ref } from 'vue';
import axios from 'axios';


export const useMovieStore = defineStore('movie', () => {
  const recommendedMovies = ref([]);
  const selectedVideoId = ref('');
  const selectedVideoTitle = ref('');
  const showModal = ref(false);
  const error = ref('');

  const youtubeApiKey = import.meta.env.VITE_YOUTUBE_API_KEY;

  function fetchMovies(keyword) {
  const API_KEY = youtubeApiKey; // 또는 const youtubeApiKey = ...
  const url = 'https://www.googleapis.com/youtube/v3/search';

  axios({
    method: 'get',
    url: url,
    params: {
      part: 'snippet',
      maxResults: 28,
      q: `${keyword} 리뷰`,
      type: 'video',
      key: API_KEY,
    },
  })
    .then((response) => {
      const items = response.data.items;
      console.log(keyword)

      if (!items || items.length === 0) {
        error.value = '예고편을 찾을 수 없습니다.';
        return;
      }

      recommendedMovies.value = items.map(item => ({
        title: item.snippet.title,
        videoId: item.id.videoId,
        thumbnail: item.snippet.thumbnails.medium.url,
      }));
    })
    .catch((err) => {
      error.value = `YouTube API 오류: ${err.message}`;
    });
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
