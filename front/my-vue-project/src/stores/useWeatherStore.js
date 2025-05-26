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
                  text: `현재 날씨는 '${description}'입니다. 이 날씨에 어울리는 영화를 한 편만 추천해 주세요.  
                          - 추천 결과는 구체적인 영화 제목이어야 하며, 실제 존재하는 영화만 알려 주세요.  
                          - 영화 제목은 한국어로 알려 주세요.  
                          - 사용자가 YouTube에서 예고편을 검색할 수 있도록, 아래 형식으로 답변해 주세요:
                          
                          출력 예시:  
                          영화 제목: [영화 제목]  
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
