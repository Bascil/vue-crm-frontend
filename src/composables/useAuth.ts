import { ref, computed } from 'vue'
import { useRouter } from 'vue-router'
import axiosInstance from '../config/axios'
import { ENDPOINTS } from '../config/api'

const accessToken = ref<string | null>(localStorage.getItem('access_token'))
const role = ref<string | null>(localStorage.getItem('role') || null)

export function useAuth() {
  const router = useRouter()

  const isAuthenticated = computed(() => !!accessToken.value)

  const setAccessToken = (token: string) => {
    accessToken.value = token
    localStorage.setItem('access_token', token)
    axiosInstance.defaults.headers.common['Authorization'] = `Bearer ${token}`
  }

  const setRole = (roleName: string) => {
    role.value = roleName
    localStorage.setItem('role', roleName)
    console.log('Role set in local storage:', localStorage.getItem('role'))  // Verify role storage
  }

  const clearAccessToken = () => {
    accessToken.value = null
    localStorage.removeItem('access_token')
    delete axiosInstance.defaults.headers.common['Authorization']
  }

  const getAccessToken = () => accessToken.value
  const getRole = () => role.value

  const login = async (email: string, password: string) => {
    try {
      const response = await axiosInstance.post(ENDPOINTS.LOGIN, { email, password })
      console.log('API Response:', response.data)  // Log the response
      const { access_token, roleName } = response.data.data
      if (access_token && roleName) {
        setAccessToken(access_token)
        setRole(roleName)
      } else {
        console.error('Unexpected API response structure:', response.data)
      }
      return response.data
    } catch (error) {
      clearAccessToken()
      console.error('Login error:', error)
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
    getAccessToken,
    getRole
  }
}
