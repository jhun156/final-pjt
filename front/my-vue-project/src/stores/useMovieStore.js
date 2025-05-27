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
  const movieTitle = ref('');

  const youtubeApiKey = import.meta.env.VITE_YOUTUBE_API_KEY;
  const jamanApiKey = import.meta.env.VITE_GEMINI_API_KEY;

  async function fetchMoviePlot(title) {
    const url = `https://generativelanguage.googleapis.com/v1/models/gemini-1.5-flash:generateContent?key=${jamanApiKey}`;

    try {
      const res = await fetch(url, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          contents: [
            {
              parts: [
                {
                  text: `
당신은 영화 평론가입니다.
아래 영화 제목에 대해 간단한 줄거리와 평가를 한국어로 2~3문장으로 알려주세요.

영화 제목: "${title}"
`
                }
              ],
            },
          ],
          generationConfig: {
            temperature: 0.7,
            maxOutputTokens: 100,
          },
        }),
      });

      const data = await res.json();
      const reply = data.candidates?.[0]?.content?.parts?.[0]?.text?.trim();
      return reply || '줄거리 정보를 찾을 수 없습니다.';
    } catch (err) {
      console.warn(`줄거리 검색 실패 (Jaman.ai): ${title}`, err.message);
      return '줄거리 정보를 찾을 수 없습니다.';
    }
  }

  async function fetchMovies(keywordString) {
    recommendedMovies.value = [];
    movieTitle.value = keywordString;

    const keywords = keywordString.split(',').map(k => k.trim()).filter(Boolean);

    for (const title of keywords) {
      // 1. 줄거리: 재미나이 Gemini API 스타일로 호출
      const plot = await fetchMoviePlot(title);
      console.log(`[줄거리 확인] "${title}" 줄거리:`, plot);

      // 2. 예고편: 유튜브 API axios.get 사용
      try {
        const youtubeRes = await axios.get('https://www.googleapis.com/youtube/v3/search', {
          params: {
            part: 'snippet',
            maxResults: 1,
            q: `${title} 예고편`,
            type: 'video',
            key: youtubeApiKey,
          }
        });

        const item = youtubeRes.data.items?.[0];
        if (!item) continue;

        recommendedMovies.value.push({
          title,
          videoId: item.id.videoId,
          thumbnail: item.snippet.thumbnails.medium.url,
          plot,   // 줄거리 저장
        });
      } catch (err) {
        console.warn(`유튜브 검색 실패: ${title}`, err.message);
      }
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
    movieTitle,
    fetchMovies,
    openModal,
    closeModal,
  };
});
