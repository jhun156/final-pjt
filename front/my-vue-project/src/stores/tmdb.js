import { ref, computed } from 'vue'
import { defineStore } from 'pinia'
import axios from 'axios'
import dayjs from 'dayjs'

export const useTMDBStore = defineStore('tmdb', () => {

  const min_date = dayjs().subtract(30, 'day').format('YYYY-MM-DD')
  const max_date = dayjs().format('YYYY-MM-DD')
  const today = dayjs().format('YYYY-MM-DD')
  const later = dayjs().add(40, 'day').format('YYYY-MM-DD')

  const API_ACCESS_KEY = import.meta.env.VITE_TMDB_ACCESS_KEY

  const TMDB_API_URL = 'https://api.themoviedb.org/3/discover/movie'
  const DETAIL_API_URL = 'https://api.themoviedb.org/3/movie'
  
  // 단일 영화 세부 내용 요청
  const fetchDetailMovie = function (id) {
    return axios({
      method: 'get',
      url: `${DETAIL_API_URL}/${id}`,
      headers: {
        accept: 'application/json',
        Authorization: `Bearer ${API_ACCESS_KEY}`
      },
      params: {
        language: 'ko-KR',
        append_to_response: 'credits'
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
      url: `${TMDB_API_URL}`,
      headers: {
        accept: 'application/json',
        Authorization: `Bearer ${API_ACCESS_KEY}`
      },
      params: {
        page: 1,
        language: 'ko-KR',
        sort_by: 'vote_average.desc',
        include_adult: false,
        include_video: false,
        without_genres: '99,10755',
        'vote_count.gte': '200',
        watch_region: 'KR',
        with_watch_providers: '8|337|97|356',
        with_watch_monetization_types: 'flatrate'
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
      url: `${TMDB_API_URL}`,
      headers: {
        accept: 'application/json',
        Authorization: `Bearer ${API_ACCESS_KEY}`
      },
      params: {
        page: 1,
        language: 'ko-KR',
        sort_by: 'popularity.desc',
        include_adult: false,
        include_video: false,
        watch_region: 'KR',
        with_watch_providers: '8|337|97|356',
        with_watch_monetization_types: 'flatrate'
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
      url: `${TMDB_API_URL}`,
      headers: {
        accept: 'application/json',
        Authorization: `Bearer ${API_ACCESS_KEY}`
      },
      params: {
        page: 1,
        language: 'ko-KR',
        sort_by: 'popularity.desc',
        include_adult: false,
        include_video: false,
        with_release_type: '2|3',
        'release_date.gte': min_date,
        'release_date.lte': max_date,
        watch_region: 'KR',
        with_watch_providers: '8|337|97|356',
        with_watch_monetization_types: 'flatrate'
      }
    })
    .then(response => response.data.results)
    .catch(error => {
      console.error('TMDB API 요청 실패', error)
      return []
    })
  }

  // 최신 개봉 순서 목록 요청
  const fetchLatestMovies = function () {
    return axios({
      method: 'get',
      url: `${TMDB_API_URL}`,
      headers: {
        accept: 'application/json',
        Authorization: `Bearer ${API_ACCESS_KEY}`
      },
      params: {
        page: 1,
        language: 'ko-KR',
        sort_by: 'popularity.desc',
        include_adult: false,
        include_video: false,
        with_release_type: '2|3',
        'release_date.gte': min_date,
        'release_date.lte': max_date,
        watch_region: 'KR',
        with_watch_providers: '8|337|97|356',
        with_watch_monetization_types: 'flatrate'
      }
    })
    .then(response => {
      return response.data.results
        .filter(movie => movie.release_date)
        .sort((a, b) => new Date(b.release_date) - new Date(a.release_date))
    })
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
    fetchLatestMovies
  }
}, { persist: true })
