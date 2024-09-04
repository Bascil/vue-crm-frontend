import api from '@/config/axios'
import { ENDPOINTS } from '@/config/api'
import { Module } from 'vuex'
import { RootState } from '@/store'

// Define types for state
interface AuthState {
  accessToken: string | null
  refreshToken: string | null
  role: string | null
  user: {
    firstName: string | null
    lastName: string | null
    email: string | null
  } | null
}

// Define types for mutation payloads
interface SetAccessTokenPayload {
  token: string
}

interface SetRefreshTokenPayload {
  token: string
}

interface SetRolePayload {
  roleName: string
}

interface SetUserPayload {
  firstName: string
  lastName: string
  email: string
}

// Define the Auth module
const auth: Module<AuthState, RootState> = {
  namespaced: true,
  state: (): AuthState => ({
    accessToken: localStorage.getItem('access_token') || null,
    refreshToken: localStorage.getItem('refresh_token') || null,
    role: localStorage.getItem('role') || null,
    user: JSON.parse(localStorage.getItem('user') || 'null')
  }),
  getters: {
    isAuthenticated: (state: AuthState) => !!state.accessToken,
    getRole: (state: AuthState) => state.role,
    getUser: (state: AuthState) => state.user
  },
  mutations: {
    SET_ACCESS_TOKEN(state: AuthState, payload: SetAccessTokenPayload) {
      state.accessToken = payload.token
      localStorage.setItem('access_token', payload.token)
      api.defaults.headers.common['Authorization'] = `Bearer ${payload.token}`
    },
    SET_REFRESH_TOKEN(state: AuthState, payload: SetRefreshTokenPayload) {
      state.refreshToken = payload.token
      localStorage.setItem('refresh_token', payload.token)
    },
    SET_ROLE(state: AuthState, payload: SetRolePayload) {
      state.role = payload.roleName
      localStorage.setItem('role', payload.roleName)
    },
    SET_USER(state: AuthState, payload: SetUserPayload) {
      state.user = payload
      localStorage.setItem('user', JSON.stringify(payload))
    },
    CLEAR_AUTH(state: AuthState) {
      state.accessToken = null
      state.refreshToken = null
      state.role = null
      state.user = null
      localStorage.removeItem('access_token')
      localStorage.removeItem('refresh_token')
      localStorage.removeItem('role')
      localStorage.removeItem('user')
      delete api.defaults.headers.common['Authorization']
    }
  },
  actions: {
    async login({ commit }, { email, password }: { email: string, password: string }) {
      try {
        const response = await api.post(ENDPOINTS.LOGIN, { email, password })
        const { access_token, refresh_token, roleName, firstName, lastName } = response.data.data
        if (access_token && roleName) {
          commit('SET_ACCESS_TOKEN', { token: access_token })
          commit('SET_REFRESH_TOKEN', { token: refresh_token })
          commit('SET_ROLE', { roleName })
          commit('SET_USER', { firstName, lastName, email })
        } else {
          console.error('Unexpected API response structure:', response.data)
        }
        return response.data
      } catch (error) {
        commit('CLEAR_AUTH')
        console.error('Login error:', error)
        throw error
      }
    },
    logout({ commit }) {
      commit('CLEAR_AUTH')
    }
  }
}

export default auth
