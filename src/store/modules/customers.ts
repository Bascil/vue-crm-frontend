import { Module } from 'vuex';
import api from '@/config/axios';
import { RootState } from '@/store';
import { ENDPOINTS } from '@/config/api';
import { useAuth } from '@/composables/useAuth';
const { getAccessToken } = useAuth();

export interface Customer {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  phoneNumber: string;
  address: string;
  isActive: boolean;
}

export interface CustomersState {
  customers: Customer[];
  meta: {
    from: number;
    to: number;
    total: number;
    perPage: number;
    lastPage: number;
    currentPage: number;
  } | null;
}

const customers: Module<CustomersState, RootState> = {
  namespaced: true,
  state: {
    customers: [],
    meta: null,
  },
  mutations: {
    setCustomers(state, { customers, meta }) {
      state.customers = customers;
      state.meta = {
        from: meta.from,
        to: meta.to,
        total: meta.total,
        perPage: meta.perPage,
        lastPage: meta.lastPage,
        currentPage: meta.currentPage,
      };
    },
    addCustomer(state, customer: Customer) {
      state.customers.push(customer);
    },
    updateCustomer(state, updatedCustomer: Customer) {
      const index = state.customers.findIndex(customer => customer.id === updatedCustomer.id);
      if (index !== -1) {
        state.customers.splice(index, 1, updatedCustomer);
      }
    },
    deleteCustomer(state, customerId: string) {
      state.customers = state.customers.filter(customer => customer.id !== customerId);
    },
  },
  actions: {
    async fetchCustomers({ commit }, { page = 1, perPage = 10 }) {
      try {
        const token = getAccessToken();
        if (token) {
          const response = await api.get(`/customers?page=${page}&perPage=${perPage}`, {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          });
          const data = response.data;
          commit('setCustomers', { customers: data.data, meta: data.meta });
        }
      } catch (error) {
        console.error('Error fetching customers:', error);
      }
    },
    async createCustomer({ commit }, user: Customer) {
        try {
          const token = getAccessToken();
          if (token) {
            api.defaults.headers.common['Authorization'] = `Bearer ${token}`;
          }
  
          const response = await api.post(ENDPOINTS.CUSTOMERS, user);
          commit('addCustomer', response.data.data);
        } catch (error) {
          console.error('Error creating user:', error);
        }
      },
      async updateCustomer({ commit }, user: Customer) {
        try {
          const token = getAccessToken();
          if (token) {
            api.defaults.headers.common['Authorization'] = `Bearer ${token}`;
          }
  
          const response = await api.put(`${ENDPOINTS.CUSTOMERS}/${user.id}`, user);
          commit('updateCustomer', response.data.data);
        } catch (error) {
          console.error('Error updating customer:', error);
        }
      },
      async deleteCustomer({ commit }, customerId: number) {
        try {
          const token = getAccessToken();
          if (token) {
            api.defaults.headers.common['Authorization'] = `Bearer ${token}`;
          }
  
          await api.delete(`${ENDPOINTS.CUSTOMERS}/${customerId}`);
          commit('deleteCustomer', customerId);
        } catch (error) {
          console.error('Error deleting customer:', error);
        }
      },
  },
  getters: {
    activeCustomers: (state) => {
      return state.customers.filter(customer => customer.isActive);
    },
  },
};

export default customers;
