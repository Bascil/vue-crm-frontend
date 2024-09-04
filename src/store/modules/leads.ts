import { Module } from 'vuex';
import api from '@/config/axios';
import { RootState } from '@/store';
import { ENDPOINTS } from '@/config/api';
import { useAuth } from '@/composables/useAuth';
const { getAccessToken } = useAuth();

export interface Lead {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  phoneNumber: string;
  source: string;
  address: string;
  status: string;
}

export interface LeadsState {
  leads: Lead[];
  meta: {
    from: number;
    to: number;
    total: number;
    perPage: number;
    lastPage: number;
    currentPage: number;
  } | null;
}

const leads: Module<LeadsState, RootState> = {
  namespaced: true,
  state: {
    leads: [],
    meta: null,
  },
  mutations: {
    setLeads(state, { leads, meta }) {
      state.leads = leads;
      state.meta = {
        from: meta.from,
        to: meta.to,
        total: meta.total,
        perPage: meta.perPage,
        lastPage: meta.lastPage,
        currentPage: meta.currentPage,
      };
    },
    addLead(state, lead: Lead) {
      state.leads.push(lead);
    },
    updateLead(state, updatedLead: Lead) {
      const index = state.leads.findIndex(lead => lead.id === updatedLead.id);
      if (index !== -1) {
        state.leads.splice(index, 1, updatedLead);
      }
    },
    deleteLead(state, leadId: string) {
      state.leads = state.leads.filter(lead => lead.id !== leadId);
    },
  },
  actions: {
    async fetchLeads({ commit }, { page = 1, perPage = 10 }) {
      try {
        const token = getAccessToken();
        if (token) {
            const response = await api.get(`${ENDPOINTS.LEADS}?page=${page}&perPage=${perPage}`, {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          });
          const data = response.data;
          commit('setLeads', { leads: data.data, meta: data.meta });
          return response
        }
      } catch (error) {
        throw error
      }
    },
    async createLead({ commit }, user: Lead) {
        try {
          const token = getAccessToken();
          if (token) {
            api.defaults.headers.common['Authorization'] = `Bearer ${token}`;
          }
  
          const response = await api.post(ENDPOINTS.LEADS, user);
          commit('addLead', response.data.data);
          return response
        } catch (error) {
          throw error
        }
      },
      async updateLead({ commit }, user: Lead) {
        try {
          const token = getAccessToken();
          if (token) {
            api.defaults.headers.common['Authorization'] = `Bearer ${token}`;
          }
  
          const response = await api.put(`${ENDPOINTS.LEADS}/${user.id}`, user);
          commit('updateLead', response.data.data);
          return response;
        } catch (error) {
          throw error
        }
      },
      async deleteLead({ commit }, leadId: number) {
        try {
          const token = getAccessToken();
          if (token) {
            api.defaults.headers.common['Authorization'] = `Bearer ${token}`;
          }
  
          const response =await api.delete(`${ENDPOINTS.LEADS}/${leadId}`);
          commit('deleteLead', leadId);
          return response
        } catch (error) {
          throw error
        }
      },
  },
  getters: {},
};

export default leads;
