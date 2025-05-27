// src/stores/useRegionStore.js
import { defineStore } from 'pinia';
import { ref } from 'vue';

export const useRegionStore = defineStore('region', () => {
  const region = ref('');
  const lat = ref('');
  const lon = ref('');
  const error = ref('');

  const kakaoApiKey = import.meta.env.VITE_KAKAO_API_KEY;

  async function fetchCoordinates() {
    if (!region.value.trim()) {
      error.value = '지역명을 입력해주세요.';
      return null;
    }

    const kakaoUrl = `https://dapi.kakao.com/v2/local/search/keyword.json?query=${encodeURIComponent(region.value)}`;

    try {
      const res = await fetch(kakaoUrl, {
        headers: {
          Authorization: `KakaoAK ${kakaoApiKey}`,
        },
      });

      if (!res.ok) throw new Error('지역 정보를 가져오지 못했습니다.');
      const data = await res.json();

      if (data.documents.length === 0) {
        error.value = '해당 지역을 찾을 수 없습니다.';
        return null;
      }
      console.log(data)
      lat.value = data.documents[0].y;
      lon.value = data.documents[0].x;
      return { lat: lat.value, lon: lon.value };
    } catch (err) {
      error.value = `위치 변환 에러: ${err.message}`;
      return null;
    }
  }

  return {
    region,
    lat,
    lon,
    error,
    fetchCoordinates,
  };
});
