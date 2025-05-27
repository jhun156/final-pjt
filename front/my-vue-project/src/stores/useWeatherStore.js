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
  이 날씨에 어울리는 영화중 평점이 높은 영화를 **10편** 추천해 주세요.

  - 영화 제목은 반드시 한국어로 작성해 주세요.  
  - 설명 없이 **오직 영화 제목만** 출력해 주세요.  
  - 다른 텍스트나 문장 없이, 영화 제목만 **쉼표로 구분해서 한 줄**로 출력해 주세요.
  출력 예시:  
  굿 윌 헌팅, 아이언맨, 범죄도시, 인사이드 아웃, 인터스텔라 ...
  `
                },
              ],
            },
          ],
          generationConfig: {
            temperature: 0.8,
            maxOutputTokens: 60,
          },
        }),
      });

      const data = await res.json();
      const reply = data.candidates?.[0]?.content?.parts?.[0]?.text?.trim();
      return reply || '굿 윌 헌팅, 아이언맨, 범죄도시';
    } catch {
      return '굿 윌 헌팅, 아이언맨, 범죄도시';
    }
  }


  return {
    currentWeather,
    keyword,
    error,
    fetchWeather,
  };
});
