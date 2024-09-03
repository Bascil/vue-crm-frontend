import { ref, computed } from 'vue'
import { useRouter } from 'vue-router'
import axiosInstance from '../config/axios'
import { ENDPOINTS } from '../config/api'

const accessToken = ref<string | null>(localStorage.getItem('access_token'))

export function useAuth() {
  const router = useRouter()

  const isAuthenticated = computed(() => !!accessToken.value)

  const setAccessToken = (token: string) => {
    accessToken.value = token
    localStorage.setItem('access_token', token)
    axiosInstance.defaults.headers.common['Authorization'] = `Bearer ${token}`
  }

  const clearAccessToken = () => {
    accessToken.value = null
    localStorage.removeItem('access_token')
    delete axiosInstance.defaults.headers.common['Authorization']
  }

  const getAccessToken = () => accessToken.value

  const login = async (email: string, password: string) => {
    try {
      const response = await axiosInstance.post(ENDPOINTS.LOGIN, { email, password })
      setAccessToken(response.data.data.access_token)
      return response.data
    } catch (error) {
      clearAccessToken()
      throw error
    }
  }

  const logout = () => {
    clearAccessToken()
    router.push('/login')
  }

  return {
    isAuthenticated,
    login,
    logout,
    getAccessToken,  // Export getAccessToken here
  }
}
