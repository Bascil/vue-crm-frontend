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
}

const users: Module<UsersState, RootState> = {
  namespaced: true,
  state: {
    users: [],
  },
  mutations: {
    setUsers(state, users: User[]) {
      state.users = users;
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
    async fetchUsers({ commit }) {
      try {
        const token = getAccessToken();
        if (token) {
          api.defaults.headers.common['Authorization'] = `Bearer ${token}`;
        }

        const response = await api.get(ENDPOINTS.USERS);
        commit('setUsers', response.data.data);
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
      } catch (error) {
        console.error('Error creating user:', error);
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
      } catch (error) {
        console.error('Error updating user:', error);
      }
    },
    async deleteUser({ commit }, userId: number) {
      try {
        const token = getAccessToken();
        if (token) {
          api.defaults.headers.common['Authorization'] = `Bearer ${token}`;
        }

        await api.delete(`${ENDPOINTS.USERS}/${userId}`);
        commit('deleteUser', userId);
      } catch (error) {
        console.error('Error deleting user:', error);
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
