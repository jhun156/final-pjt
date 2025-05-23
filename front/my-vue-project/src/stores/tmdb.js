import { ref, computed } from 'vue'
import { defineStore } from 'pinia'
import axios from 'axios'

export const useTMDBStore = defineStore('tmdb', () => {

  const TOP_RATED_API_URL = 'https://api.themoviedb.org/3/movie/top_rated?language=ko-KR&page=1'
  const DETAIL_API_URL = 'https://api.themoviedb.org/3/movie'
  const API_ACCESS_KEY = import.meta.env.VITE_TMDB_ACCESS_KEY

  const fetchTopRatedMovies = () => {
    return axios.get(TOP_RATED_API_URL, {
      headers: {
        accept: 'application/json',
        Authorization: `Bearer ${API_ACCESS_KEY}`
      }
    })
    .then(response => response.data.results)
    .catch(error => {
      console.error('TMDB API 요청 실패', error)
      return []
    })
  }

  const fetchDetailMovie = (id) => {
    return axios.get(`${DETAIL_API_URL}/${id}?language=ko-KR`, {
      headers: {
        accept: 'application/json',
        Authorization: `Bearer ${API_ACCESS_KEY}`
      }
    })
    .then(response => response.data)
    .catch(error => {
      console.error('TMDB API 요청 실패', error)
      return {}
    })
  }
  return { fetchTopRatedMovies, fetchDetailMovie }
},{persist:true})
