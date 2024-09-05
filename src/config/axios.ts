import axios, { AxiosError, AxiosRequestConfig, AxiosResponse } from 'axios'
import store from '@/store'
import { API_BASE_URL } from './api'
import { ENDPOINTS } from '@/config/api'

// Define response structure for the refresh token API (adapt based on actual API response)
interface RefreshTokenResponse {
  access_token: string
}

// Define your Axios request config with retry property
interface CustomAxiosRequestConfig extends AxiosRequestConfig {
  _retryCount?: number // Custom retry count
  _retry?: boolean // Custom flag to check if it's a retry
}

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
})

// Set the max number of retries
const MAX_RETRIES = 3

// Request Interceptor
api.interceptors.request.use(
  (config: any) => {
    const token = localStorage.getItem('access_token')
    if (token) {
      config.headers!['Authorization'] = `Bearer ${token}`
    }
    return config
  },
  (error: AxiosError) => {
    return Promise.reject(error)
  }
)

let isRefreshing = false
let failedQueue: { resolve: (value?: unknown) => void; reject: (reason?: any) => void }[] = []

const processQueue = (error: any, token: string | null = null) => {
  failedQueue.forEach((prom) => {
    if (error) {
      prom.reject(error)
    } else {
      prom.resolve(token)
    }
  })
  failedQueue = []
}

// Response Interceptor
api.interceptors.response.use(
  (response: AxiosResponse) => response,
  async (error: AxiosError) => {
    const originalRequest = error.config as CustomAxiosRequestConfig

    // Initialize retry count if not present
    if (!originalRequest._retryCount) {
      originalRequest._retryCount = 0
    }

    // Handle unauthorized (401) or forbidden (403) errors
    if (
      (error.response?.status === 401 || error.response?.status === 403) &&
      originalRequest._retryCount < MAX_RETRIES
    ) {
      if (isRefreshing) {
        return new Promise((resolve, reject) => {
          failedQueue.push({ resolve, reject })
        }).then((token) => {
          if (token) {
            originalRequest.headers!['Authorization'] = `Bearer ${token}`
          }
          return api(originalRequest)
        }).catch((err) => Promise.reject(err))
      }

      originalRequest._retry = true
      originalRequest._retryCount += 1
      isRefreshing = true

      try {
        const response = await api.post<RefreshTokenResponse>(ENDPOINTS.REFRESH_TOKEN, {
          refreshToken: localStorage.getItem('refresh_token'),
        })

        const { access_token } = response.data
        store.commit('auth/SET_ACCESS_TOKEN', { token: access_token })

        originalRequest.headers!['Authorization'] = `Bearer ${access_token}`
        processQueue(null, access_token)
        return api(originalRequest) // Retry original request after refresh
      } catch (refreshError) {
        processQueue(refreshError, null)
        store.commit('auth/CLEAR_AUTH')
        return Promise.reject(refreshError)
      } finally {
        isRefreshing = false
      }
    } else if (originalRequest._retryCount >= MAX_RETRIES) {
      return Promise.reject(new Error(`Max retries reached (${MAX_RETRIES})`))
    }

    return Promise.reject(error)
  }
)

export default api
