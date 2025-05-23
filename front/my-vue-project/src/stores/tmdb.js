import { ref, computed } from 'vue'
import { defineStore } from 'pinia'
import axios from 'axios'

export const useTMDBStore = defineStore('tmdb', () => {

  const TOP_RATED_API_URL = 'https://api.themoviedb.org/3/movie/top_rated'
  const DETAIL_API_URL = 'https://api.themoviedb.org/3/movie'
  const API_ACCESS_KEY = import.meta.env.VITE_TMDB_ACCESS_KEY

  const today = new Date();
  const lastMonth = new Date();
  lastMonth.setMonth(today.getMonth() - 1)

  const formatDate = (date) => date.toISOString().split('T')[0];
  const lastMonthStr = formatDate(lastMonth);

  const fetchTopRatedMovies = function () {
    return axios({
      method: 'get',
      url: TOP_RATED_API_URL,
      headers: {
        accept: 'application/json',
        Authorization: `Bearer ${API_ACCESS_KEY}`
      },
      params: {
        page: 50,
        language: 'ko-KR',
        sort_by: 'popularity.desc',
        region: 'KR',
        'primary_release_date.gte': lastMonthStr,
      }
    })
    .then(response => response.data.results)
    .catch(error => {
      console.error('TMDB API 요청 실패', error)
      return []
    })
  }

  const fetchDetailMovie = function (id) {
    return axios({
      method: 'get',
      url: `${DETAIL_API_URL}/${id}?language=ko-KR`,
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

  return {
    fetchTopRatedMovies,
    fetchDetailMovie
  }
}, { persist: true })
