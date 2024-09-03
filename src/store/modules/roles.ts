import { Module } from 'vuex';
import api from '@/config/axios';
import { RootState } from '@/store';
import { ENDPOINTS } from '@/config/api';
import { useAuth } from '@/composables/useAuth';

// Define Role and Permission interfaces
export interface Role {
  id: string;
  name: string;
  permissions: string[];
}

export interface Permission {
  id: string;
  name: string;
}

// Define the state interface for the Roles module
export interface RolesState {
  roles: Role[];
  permissions: Permission[];
}

const { getAccessToken } = useAuth();

const roles: Module<RolesState, RootState> = {
  namespaced: true,
  state: {
    roles: [],
    permissions: [],
  },
  mutations: {
    setRoles(state, roles: Role[]) {
      state.roles = roles;
    },
    addRole(state, role: Role) {
      state.roles.push(role);
    },
    updateRole(state, updatedRole: Role) {
      const index = state.roles.findIndex(role => role.id === updatedRole.id);
      if (index !== -1) {
        state.roles.splice(index, 1, updatedRole);
      }
    },
    deleteRole(state, roleId: string) {
      state.roles = state.roles.filter(role => role.id !== roleId);
    },
    setPermissions(state, permissions: Permission[]) {
      state.permissions = permissions;
    },
  },
  actions: {
    async fetchRoles({ commit }) {
      try {
        const token = getAccessToken();
        if (token) {
          api.defaults.headers.common['Authorization'] = `Bearer ${token}`;
        }

        const response = await api.get(ENDPOINTS.ROLES);
        commit('setRoles', response.data.data);
      } catch (error) {
        console.error('Error fetching roles:', error);
      }
    },
    async fetchPermissions({ commit }) {
      try {
        const token = getAccessToken();
        if (token) {
          api.defaults.headers.common['Authorization'] = `Bearer ${token}`;
        }

        const response = await api.get(ENDPOINTS.PERMISSIONS);
        commit('setPermissions', response.data.data);
      } catch (error) {
        console.error('Error fetching permissions:', error);
      }
    },
    async createRole({ commit }, role: Role) {
      try {
        const token = getAccessToken();
        if (token) {
          api.defaults.headers.common['Authorization'] = `Bearer ${token}`;
        }

        const response = await api.post(ENDPOINTS.ROLES, role);
        commit('addRole', response.data.data);
      } catch (error) {
        console.error('Error creating role:', error);
      }
    },
    async updateRole({ commit }, role: Role) {
      try {
        const token = getAccessToken();
        if (token) {
          api.defaults.headers.common['Authorization'] = `Bearer ${token}`;
        }

        const response = await api.put(`${ENDPOINTS.ROLES}/${role.id}`, role);
        commit('updateRole', response.data.data);
      } catch (error) {
        console.error('Error updating role:', error);
      }
    },
    async deleteRole({ commit }, roleId: string) {
      try {
        const token = getAccessToken();
        if (token) {
          api.defaults.headers.common['Authorization'] = `Bearer ${token}`;
        }

        await api.delete(`${ENDPOINTS.ROLES}/${roleId}`);
        commit('deleteRole', roleId);
      } catch (error) {
        console.error('Error deleting role:', error);
      }
    },
  },
  getters: {
    rolesByPermission: (state) => (permissionName: string) => {
      return state.roles.filter(role =>
        role.permissions.includes(permissionName)
      );
    },
  },
};

export default roles;
