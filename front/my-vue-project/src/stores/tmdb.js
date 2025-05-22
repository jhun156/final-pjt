import { ref, computed } from 'vue'
import { defineStore } from 'pinia'
import axios from 'axios'

export const useTMDBStore = defineStore('tmdb', () => {

  const TOP_RATED_API_URL = 'https://api.themoviedb.org/3/movie/top_rated?language=ko-KR&page=1'
  const DETAIL_API_URL = 'https://api.themoviedb.org/3/movie'
  const API_ACCESS_KEY = import.meta.env.VITE_TMDB_ACCESS_KEY

  const fetchTopRatedMovies = async () => {
    try {
      const response = await axios.get(TOP_RATED_API_URL, {
        headers: {
          accept: 'application/json',
          Authorization: `Bearer ${API_ACCESS_KEY}`
        }
      })
      return response.data.results  // 데이터값만 반환, 배열에 할당은 컴포넌트에서 진행(통일한 방식)
    } catch (error) {
      console.error('TMDB API 요청 실패', error)
      return [] // 실패시 빈 배열 반환
    }
  } // 여기 꼭 닫아야 합니다!!

  const fetchDetailMovie = async (id) => {
    try {
      // 예: /movie/{movie_id}/credits  (credit API임으로 경로 맞춰야함)
      const response = await axios.get(`${DETAIL_API_URL}/${id}?language=ko-KR`, {
        headers: {
          accept: 'application/json',
          Authorization: `Bearer ${API_ACCESS_KEY}`
        }
      })
      return response.data
    } catch (error) {
      console.error('TMDB API 요청 실패', error)
      return {} // 실패 시 빈 객체 반환
    }
  }
  return { fetchTopRatedMovies, fetchDetailMovie }
},{persist:true})
