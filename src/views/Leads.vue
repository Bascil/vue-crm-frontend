<script lang="ts" setup>
import { ref, reactive, computed, onMounted } from 'vue';
import { useStore } from 'vuex';

// Define types
interface Lead {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  phoneNumber: string;
  source: string;
  address: string;
  status: string;
}

const store = useStore();
const openModal = ref(false);
const isEditMode = ref(false);
const formData = reactive<Lead>({
  id: '',
  firstName: '',
  lastName: '',
  email: '',
  phoneNumber: '',
  source: '',
  address: '',
  status: 'new',
});

const leads = computed(() => store.state.leads.leads);
const meta = computed(() => store.state.leads.meta);
const currentPage = ref(1);
const perPage = ref(10);

function openLeadModal(lead: Lead | null = null) {
  isEditMode.value = !!lead;
  if (lead) {
    Object.assign(formData, lead);
  } else {
    Object.assign(formData, {
      id: '',
      firstName: '',
      lastName: '',
      email: '',
      phoneNumber: '',
      source: '',
      address: '',
      status: 'new',
    });
  }
  openModal.value = true;
}

function submitForm() {
  if (isEditMode.value) {
    store.dispatch('leads/updateLead', formData);
  } else {
    store.dispatch('leads/createLead', formData);
  }
  openModal.value = false;
}

function deleteLead(leadId: string) {
  store.dispatch('leads/deleteLead', leadId);
}

function handleCreateLeadClick() {
  openLeadModal();
}

function handlePageChange(page: number) {
  currentPage.value = page;
  store.dispatch('leads/fetchLeads', { page: currentPage.value, perPage: perPage.value });
}

onMounted(() => {
  store.dispatch('leads/fetchLeads', { page: currentPage.value, perPage: perPage.value });
});
</script>

<template>
  <h3 class="text-3xl font-medium text-gray-700">Leads List</h3>

  <div class="mt-4">
    <!-- Create Lead Button -->
    <button @click="handleCreateLeadClick" class="px-4 py-2 font-medium tracking-wide text-white capitalize transition-colors duration-200 transform bg-indigo-600 rounded-md hover:bg-indigo-500 focus:outline-none focus:bg-indigo-500">
      Create Lead
    </button>

    <div class="flex flex-col mt-6">
      <div class="py-2 -my-2 overflow-x-auto sm:-mx-6 sm:px-6 lg:-mx-8 lg:px-8">
        <div class="inline-block min-w-full overflow-hidden align-middle border-b border-gray-200 shadow sm:rounded-lg">
          <table class="min-w-full">
            <thead>
              <tr>
                <th class="px-6 py-3 text-xs font-medium leading-4 tracking-wider text-left text-gray-500 uppercase bg-gray-100 border-b border-gray-200">First Name</th>
                <th class="px-6 py-3 text-xs font-medium leading-4 tracking-wider text-left text-gray-500 uppercase bg-gray-100 border-b border-gray-200">Last Name</th>
                <th class="px-6 py-3 text-xs font-medium leading-4 tracking-wider text-left text-gray-500 uppercase bg-gray-100 border-b border-gray-200">Email</th>
                <th class="px-6 py-3 text-xs font-medium leading-4 tracking-wider text-left text-gray-500 uppercase bg-gray-100 border-b border-gray-200">Phone Number</th>
                <th class="px-6 py-3 text-xs font-medium leading-4 tracking-wider text-left text-gray-500 uppercase bg-gray-100 border-b border-gray-200">Source</th>
                <th class="px-6 py-3 text-xs font-medium leading-4 tracking-wider text-left text-gray-500 uppercase bg-gray-100 border-b border-gray-200">Status</th>
                <th class="px-6 py-3 bg-gray-100 border-b border-gray-200"></th>
              </tr>
            </thead>

            <tbody class="bg-white">
              <tr v-for="(lead, index) in leads" :key="index">
                <td class="px-6 py-4 border-b border-gray-200 whitespace-nowrap">{{ lead.firstName }}</td>
                <td class="px-6 py-4 border-b border-gray-200 whitespace-nowrap">{{ lead.lastName }}</td>
                <td class="px-6 py-4 border-b border-gray-200 whitespace-nowrap">{{ lead.email }}</td>
                <td class="px-6 py-4 border-b border-gray-200 whitespace-nowrap">{{ lead.phoneNumber }}</td>
                <td class="px-6 py-4 border-b border-gray-200 whitespace-nowrap">{{ lead.source }}</td>
                <td class="px-6 py-4 border-b border-gray-200 whitespace-nowrap">{{ lead.status }}</td>

                <td class="px-6 py-4 text-sm font-medium leading-5 text-right border-b border-gray-200 whitespace-nowrap">
                  <a href="#" @click="openLeadModal(lead)" class="text-indigo-600 hover:text-indigo-900">Edit</a>
                  <a href="#" @click="deleteLead(lead.id)" class="text-red-600 hover:text-red-900 ml-4">Delete</a>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>

      <!-- Pagination Controls -->
      <div v-if="meta" class="mt-4 flex justify-between items-center">
        <button
          @click="handlePageChange(meta.currentPage - 1)"
          :disabled="meta.currentPage === 1"
          class="px-4 py-2 font-medium text-gray-700 bg-gray-200 rounded-md hover:bg-gray-300 disabled:opacity-50"
        >
          Previous
        </button>
        <span>Page {{ meta.currentPage }} of {{ meta.lastPage }}</span>
        <button
          @click="handlePageChange(meta.currentPage + 1)"
          :disabled="meta.currentPage === meta.lastPage"
          class="px-4 py-2 font-medium text-gray-700 bg-gray-200 rounded-md hover:bg-gray-300 disabled:opacity-50"
        >
          Next
        </button>
      </div>
    </div>
  </div>

  <!-- Modal Template -->
  <div>
    <div :class="`modal ${!openModal ? 'opacity-0 pointer-events-none' : 'opacity-100 pointer-events-auto'} z-50 fixed w-full h-full top-0 left-0 flex items-center justify-center`">
      <div class="absolute w-full h-full bg-gray-900 opacity-50 modal-overlay" @click="openModal = false"></div>
      <div class="z-50 w-11/12 mx-auto overflow-y-auto bg-white rounded shadow-lg modal-container md:max-w-md">
        <div class="absolute top-0 right-0 z-50 flex flex-col items-center mt-4 mr-4 text-sm text-white cursor-pointer modal-close">
          <svg class="text-white fill-current" xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 18 18"><path d="M14.53 4.53l-1.06-1.06L9 7.94 4.53 3.47 3.47 4.53 7.94 9l-4.47 4.47 1.06 1.06L9 10.06l4.47 4.47 1.06-1.06L10.06 9z"/></svg>
          <span class="text-sm">(Esc)</span>
        </div>

        <div class="px-6 py-4 text-left modal-content">
          <div class="flex items-center justify-between pb-3">
            <p class="text-2xl font-bold">{{ isEditMode ? 'Edit Lead' : 'Create Lead' }}</p>
            <div class="z-50 cursor-pointer modal-close" @click="openModal = false">
              <svg class="text-black fill-current" xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 18 18"><path d="M14.53 4.53l-1.06-1.06L9 7.94 4.53 3.47 3.47 4.53 7.94 9l-4.47 4.47 1.06 1.06L9 10.06l4.47 4.47 1.06-1.06L10.06 9z"/></svg>
            </div>
          </div>
          <div class="mt-2">
            <input v-model="formData.firstName" type="text" placeholder="First Name" class="w-full px-4 py-2 mb-2 border rounded-md">
            <input v-model="formData.lastName" type="text" placeholder="Last Name" class="w-full px-4 py-2 mb-2 border rounded-md">
            <input v-model="formData.email" type="email" placeholder="Email" class="w-full px-4 py-2 mb-2 border rounded-md">
            <input v-model="formData.phoneNumber" type="text" placeholder="Phone Number" class="w-full px-4 py-2 mb-2 border rounded-md">
            <input v-model="formData.source" type="text" placeholder="Source" class="w-full px-4 py-2 mb-2 border rounded-md">
            <input v-model="formData.address" type="text" placeholder="Address" class="w-full px-4 py-2 mb-2 border rounded-md">
            <select v-model="formData.status" class="w-full px-4 py-2 mb-2 border rounded-md">
              <option value="new">New</option>
              <option value="contacted">Contacted</option>
              <option value="qualified">Qualified</option>
            </select>
          </div>

          <!-- Modal Footer -->
          <div class="flex justify-end pt-4 space-x-4">
            <button @click="openModal = false" class="px-4 py-2 text-white bg-gray-500 rounded-md hover:bg-gray-600">Cancel</button>
            <button @click="submitForm" class="px-4 py-2 text-white bg-blue-500 rounded-md hover:bg-blue-600">{{ isEditMode ? 'Update' : 'Create' }}</button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.modal {
  transition: opacity 0.3s ease;
}
.modal-overlay {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
}
.modal-container {
  position: relative;
  max-width: 500px;
  width: 100%;
}
.modal-close {
  cursor: pointer;
}
</style>
