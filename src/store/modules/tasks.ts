import { Module } from 'vuex';
import api from '@/config/axios';
import { RootState } from '@/store';
import { ENDPOINTS } from '@/config/api';
import { useAuth } from '@/composables/useAuth';
const { getAccessToken } = useAuth();

export interface Task {
  id: string;
  title: string;
  description: string;
  status: string;
  dueDate: string;
  projectId: string;
  projectName: string;
}

export interface TasksState {
  tasks: Task[];
  meta: {
    from: number;
    to: number;
    total: number;
    perPage: number;
    lastPage: number;
    currentPage: number;
  } | null;
}

const tasks: Module<TasksState, RootState> = {
  namespaced: true,
  state: {
    tasks: [],
    meta: null,
  },
  mutations: {
    setTasks(state, { tasks, meta }) {
      state.tasks = tasks;
      state.meta = {
        from: meta.from,
        to: meta.to,
        total: meta.total,
        perPage: meta.perPage,
        lastPage: meta.lastPage,
        currentPage: meta.currentPage,
      };
    },
    addTask(state, task: Task) {
      state.tasks.push(task);
    },
    updateTask(state, updatedTask: Task) {
      const index = state.tasks.findIndex(task => task.id === updatedTask.id);
      if (index !== -1) {
        state.tasks.splice(index, 1, updatedTask);
      }
    },
    deleteTask(state, taskId: string) {
      state.tasks = state.tasks.filter(task => task.id !== taskId);
    },
  },
  actions: {
    async fetchTasks({ commit }, { page = 1, perPage = 10 }) {
      try {
        const token = getAccessToken();
        if (token) {
          const response = await api.get(`${ENDPOINTS.TASKS}?page=${page}&perPage=${perPage}`, {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          });
          const data = response.data;
          commit('setTasks', { tasks: data.data, meta: data.meta });
          return response
        }
      } catch (error) {
        throw error
      }
    },
    async createTask({ commit }, user: Task) {
        try {
          const token = getAccessToken();
          if (token) {
            api.defaults.headers.common['Authorization'] = `Bearer ${token}`;
          }
  
          const response = await api.post(ENDPOINTS.TASKS, user);
          commit('addTask', response.data.data);
          return response
        } catch (error) {
          throw error
        }
      },
      async updateTask({ commit }, user: Task) {
        try {
          const token = getAccessToken();
          if (token) {
            api.defaults.headers.common['Authorization'] = `Bearer ${token}`;
          }
  
          const response = await api.put(`${ENDPOINTS.TASKS}/${user.id}`, user);
          commit('updateTask', response.data.data);
          return response
        } catch (error) {
          throw error
        }
      },
      async deleteTask({ commit }, taskId: number) {
        try {
          const token = getAccessToken();
          if (token) {
            api.defaults.headers.common['Authorization'] = `Bearer ${token}`;
          }
  
          const response = await api.delete(`${ENDPOINTS.TASKS}/${taskId}`);
          commit('deleteTask', taskId);
          return response
        } catch (error) {
          throw error
        }
      },
  },
  getters: {},
};

export default tasks;
