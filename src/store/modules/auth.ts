import api from '@/config/axios'
import { ENDPOINTS } from '@/config/api'
import { Module } from 'vuex'
import { RootState } from '@/store'

// Define types for state
interface AuthState {
  accessToken: string | null
  role: string | null
}

// Define types for mutation payloads
interface SetAccessTokenPayload {
  token: string
}

interface SetRolePayload {
  roleName: string
}

// Define the Auth module
const auth: Module<AuthState, RootState> = {
  namespaced: true,
  state: (): AuthState => ({
    accessToken: localStorage.getItem('access_token') || null,
    role: localStorage.getItem('role') || null,
  }),
  getters: {
    isAuthenticated: (state: AuthState) => !!state.accessToken,
    getRole: (state: AuthState) => state.role,
  },
  mutations: {
    SET_ACCESS_TOKEN(state: AuthState, payload: SetAccessTokenPayload) {
      state.accessToken = payload.token
      localStorage.setItem('access_token', payload.token)
      api.defaults.headers.common['Authorization'] = `Bearer ${payload.token}`
    },
    SET_ROLE(state: AuthState, payload: SetRolePayload) {
      state.role = payload.roleName
      localStorage.setItem('role', payload.roleName)
    },
    CLEAR_AUTH(state: AuthState) {
      state.accessToken = null
      state.role = null
      localStorage.removeItem('access_token')
      localStorage.removeItem('role')
      delete api.defaults.headers.common['Authorization']
    }
  },
  actions: {
    async login({ commit }, { email, password }: { email: string, password: string }) {
      try {
        const response = await api.post(ENDPOINTS.LOGIN, { email, password })
        const { access_token, roleName } = response.data.data
        if (access_token && roleName) {
          commit('SET_ACCESS_TOKEN', { token: access_token })
          commit('SET_ROLE', { roleName })
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

