// src/stores/useWeatherStore.js
import { defineStore } from 'pinia';
import { ref } from 'vue';

export const useWeatherStore = defineStore('weather', () => {
  const currentWeather = ref('');
  const keyword = ref('');
  const error = ref('');

  const weatherApiKey = import.meta.env.VITE_WEATHER_API_KEY;
  const geminiApiKey = import.meta.env.VITE_GEMINI_API_KEY;

  async function fetchWeather(lat, lon) {
    const url = `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&appid=${weatherApiKey}&lang=kr&units=metric`;

    try {
      const res = await fetch(url);
      if (!res.ok) throw new Error(`날씨 정보를 가져오는데 실패했습니다: ${res.status}`);
      const data = await res.json();

      const description = data.weather[0].description;
      currentWeather.value = `${description}, 온도: ${data.main.temp}°C`;

      keyword.value = await getKeyword(description);
      return keyword.value;
    } catch (err) {
      error.value = err.message;
      return null;
    }
  }

  async function getKeyword(description) {
    const url = `https://generativelanguage.googleapis.com/v1/models/gemini-1.5-flash:generateContent?key=${geminiApiKey}`;

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
                        현재 날씨는 '${description}'입니다.  
                        이 날씨에 어울리는 영화중 평점이 높은 영화를 한 편 추천해 주세요.

                        - 추천 결과는 실제 존재하는 영화만 포함해야 합니다.  
                        - 영화 제목은 반드시 한국어로 작성해 주세요.  
                        - 설명 없이 **오직 영화 제목만** 출력해 주세요.  
                        - 예고편 링크, 줄거리, 기타 정보는 출력하지 마세요.  
                        - 다른 텍스트나 문장 없이, 한 줄로 영화 제목만 출력해 주세요.
                        출력 예시:  
                        (예:굿 월 헌팅 ) 
                        `
                },
              ],
            },
          ],
          generationConfig: {
            temperature: 0.8,
            maxOutputTokens: 30,
          },
        }),
      });

      const data = await res.json();
      const reply = data.candidates?.[0]?.content?.parts?.[0]?.text?.trim();
      return reply || '흥미 스릴러';
    } catch {
      return '흥미 스릴러';
    }
  }

  return {
    currentWeather,
    keyword,
    error,
    fetchWeather,
  };
});
