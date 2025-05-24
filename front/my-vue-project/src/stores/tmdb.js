import { ref, computed } from 'vue'
import { defineStore } from 'pinia'
import axios from 'axios'

export const useTMDBStore = defineStore('tmdb', () => {

  const API_ACCESS_KEY = import.meta.env.VITE_TMDB_ACCESS_KEY

  const TMDB_API_URL = 'https://api.themoviedb.org/3/movie'
  
  // 단일 영화 세부 내용 요청
  const fetchDetailMovie = function (id) {
    return axios({
      method: 'get',
      url: `${TMDB_API_URL}/${id}?language=ko-KR`,
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

  // 높은 랭킹순 내용 요청, 기본 조회와 동일
  const fetchTopRatedMovies = function () {
    return axios({
      method: 'get',
      url: `${TMDB_API_URL}/top_rated`,
      headers: {
        accept: 'application/json',
        Authorization: `Bearer ${API_ACCESS_KEY}`
      },
      params: {
        page: 1,
        language: 'ko-KR'
      }
    })
    .then(response => response.data.results)
    .catch(error => {
      console.error('TMDB API 요청 실패', error)
      return []
    })
  }

  // 인기 영화 목록 요청
  const fetchPopularMovies = function () {
    return axios({
      method: 'get',
      url: `${TMDB_API_URL}/popular`,
      headers: {
        accept: 'application/json',
        Authorization: `Bearer ${API_ACCESS_KEY}`
      },
      params: {
        page: 1,
        language: 'ko-KR',
      }
    })
    .then(response => response.data.results)
    .catch(error => {
      console.error('TMDB API 요청 실패', error)
      return []
    })
  }

  // 현재 상영작 목록 요청
  const fetchNowPlayingMovies = function () {
    return axios({
      method: 'get',
      url: `${TMDB_API_URL}/now_playing`,
      headers: {
        accept: 'application/json',
        Authorization: `Bearer ${API_ACCESS_KEY}`
      },
      params: {
        page: 1,
        language: 'ko-KR',
      }
    })
    .then(response => response.data.results)
    .catch(error => {
      console.error('TMDB API 요청 실패', error)
      return []
    })
  }

  // 개봉 예정 영화 목록 요청
  const fetchUpComingMovies = function () {
    return axios({
      method: 'get',
      url: `${TMDB_API_URL}/upcoming`,
      headers: {
        accept: 'application/json',
        Authorization: `Bearer ${API_ACCESS_KEY}`
      },
      params: {
        page: 1,
        language: 'ko-KR',
      }
    })
    .then(response => response.data.results)
    .catch(error => {
      console.error('TMDB API 요청 실패', error)
      return []
    })
  }

  return {
    fetchTopRatedMovies,
    fetchDetailMovie,
    fetchPopularMovies,
    fetchNowPlayingMovies,
    fetchUpComingMovies
  }
}, { persist: true })
