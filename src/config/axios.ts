import axios from 'axios'
import store from '@/store'
import { API_BASE_URL } from './api'
import { ENDPOINTS } from '@/config/api'

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
})

// Request Interceptor
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('access_token')
    if (token) {
      config.headers['Authorization'] = `Bearer ${token}`
    }
    return config
  },
  (error) => {
    return Promise.reject(error)
  }
)

// Response Interceptor
api.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config

    if ((error.response.status === 401 || error.response.status === 403) && !originalRequest._retry) {
      originalRequest._retry = true

      try {
        const response = await api.post(ENDPOINTS.REFRESH_TOKEN, {
          refreshToken: localStorage.getItem('refresh_token')
        })

        const { access_token } = response.data

        store.commit('auth/SET_ACCESS_TOKEN', { token: access_token })
        originalRequest.headers['Authorization'] = `Bearer ${access_token}`

        return api(originalRequest) // Retry the original request
      } catch (refreshError) {
        store.commit('auth/CLEAR_AUTH')
        return Promise.reject(refreshError)
      }
    }

    return Promise.reject(error)
  }
)

export default api