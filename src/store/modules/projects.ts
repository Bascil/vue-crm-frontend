import { Module } from 'vuex';
import api from '@/config/axios';
import { RootState } from '@/store';
import { ENDPOINTS } from '@/config/api';
import { useAuth } from '@/composables/useAuth';
const { getAccessToken } = useAuth();

interface Project {
    id: string;
    name: string;
    description: string;
    status: string;
    startDate: string;
    endDate: string;
  }

export interface ProjectsState {
  projects: Project[];
  meta: {
    from: number;
    to: number;
    total: number;
    perPage: number;
    lastPage: number;
    currentPage: number;
  } | null;
}

const projects: Module<ProjectsState, RootState> = {
  namespaced: true,
  state: {
    projects: [],
    meta: null,
  },
  mutations: {
    setProjects(state, { projects, meta }) {
      state.projects = projects;
      state.meta = {
        from: meta.from,
        to: meta.to,
        total: meta.total,
        perPage: meta.perPage,
        lastPage: meta.lastPage,
        currentPage: meta.currentPage,
      };
    },
    addProject(state, project: Project) {
      state.projects.push(project);
    },
    updateProject(state, updatedProject: Project) {
      const index = state.projects.findIndex(project => project.id === updatedProject.id);
      if (index !== -1) {
        state.projects.splice(index, 1, updatedProject);
      }
    },
    deleteProject(state, projectId: string) {
      state.projects = state.projects.filter(project => project.id !== projectId);
    },
  },
  actions: {
    async fetchProjects({ commit }, { page = 1, perPage = 10 }) {
      try {
        const token = getAccessToken();
        if (token) {
            const response = await api.get(`${ENDPOINTS.PROJECTS}?page=${page}&perPage=${perPage}`, {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          });
          const data = response.data;
          commit('setProjects', { projects: data.data, meta: data.meta });
          return response;
        }
      } catch (error) {
        console.error('Error fetching projects:', error);
      }
    },
    async createProject({ commit }, project: Project) {
        try {
          const token = getAccessToken();
          if (token) {
            api.defaults.headers.common['Authorization'] = `Bearer ${token}`;
          }
  
          const response = await api.post(ENDPOINTS.PROJECTS, project);
          commit('addProject', response.data.data);
          return response
          
        } catch (error) {
          throw error;
        }
      },
      async updateProject({ commit }, project: Project) {
        try {
          const token = getAccessToken();
          if (token) {
            api.defaults.headers.common['Authorization'] = `Bearer ${token}`;
          }
  
          const response = await api.put(`${ENDPOINTS.PROJECTS}/${project.id}`, project);
          commit('updateProject', response.data.data);
          return response;
        } catch (error) {
          throw error;
        }
      },
      async deleteProject({ commit }, projectId: number) {
        try {
          const token = getAccessToken();
          if (token) {
            api.defaults.headers.common['Authorization'] = `Bearer ${token}`;
          }
  
          const response = await api.delete(`${ENDPOINTS.PROJECTS}/${projectId}`);
          commit('deleteProject', projectId);
          return response;
        } catch (error) {
          throw error
        }
      },
  },
  getters: {},
};

export default projects;
