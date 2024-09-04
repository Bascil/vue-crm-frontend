import { Module } from 'vuex';
import api from '@/config/axios';
import { RootState } from '@/store';
import { ENDPOINTS } from '@/config/api';
import { useAuth } from '@/composables/useAuth';

const { getAccessToken } = useAuth();

// Define the state interface for the Users module
export interface User {
  id: number;
  firstName: string;
  lastName: string;
  email: string;
  roles: { name: string }[];
}

export interface UsersState {
  users: User[];
  meta: {
    from: number;
    to: number;
    total: number;
    perPage: number;
    lastPage: number;
    currentPage: number;
  } | null;
}


const users: Module<UsersState, RootState> = {
   namespaced: true,
  state: {
    users: [],
    meta: null,
  },
  mutations: {
    setUsers(state, data: { users: User[], meta: UsersState['meta'] }) {
      state.users = data.users;
      state.meta = data.meta;
    },
    addUser(state, user: User) {
      state.users.push(user);
    },
    updateUser(state, updatedUser: User) {
      const index = state.users.findIndex(user => user.id === updatedUser.id);
      if (index !== -1) {
        state.users.splice(index, 1, updatedUser);
      }
    },
    deleteUser(state, userId: number) {
      state.users = state.users.filter(user => user.id !== userId);
    },
  },
  actions: {
    async fetchUsers({ commit }, { page = 1, perPage = 10 }) {
      try {
        const token = getAccessToken();
        if (token) {
          const response = await api.get(`${ENDPOINTS.USERS}?page=${page}&perPage=${perPage}`, {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          });
          const data = response.data;
          commit('setUsers', { users: data.data, meta: data.meta });
        }
      } catch (error) {
        console.error('Error fetching users:', error);
      }
    },
    async createUser({ commit }, user: User) {
      try {
        const token = getAccessToken();
        if (token) {
          api.defaults.headers.common['Authorization'] = `Bearer ${token}`;
        }

        const response = await api.post(ENDPOINTS.USERS, user);
        commit('addUser', response.data.data);
        return response
      } catch (error) {
        throw error
      }
    },
    async updateUser({ commit }, user: User) {
      try {
        const token = getAccessToken();
        if (token) {
          api.defaults.headers.common['Authorization'] = `Bearer ${token}`;
        }

        const response = await api.put(`${ENDPOINTS.USERS}/${user.id}`, user);
        commit('updateUser', response.data.data);
        return response
      } catch (error) {
        throw error
      }
    },
    async deleteUser({ commit }, userId: number) {
      try {
        const token = getAccessToken();
        if (token) {
          api.defaults.headers.common['Authorization'] = `Bearer ${token}`;
        }

        const response = await api.delete(`${ENDPOINTS.USERS}/${userId}`);
        commit('deleteUser', userId);
        return response
      } catch (error) {
        throw error
      }
    },
  },
  getters: {
    usersByRole: (state) => (roleName: string) => {
      return state.users.filter(user =>
        user.roles.some(role => role.name === roleName)
      );
    },
  },
};

export default users;
