<script lang="ts" setup>
import { ref, reactive, computed, onMounted } from 'vue';
import { useStore } from 'vuex';

// Define types
interface Customer {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  phoneNumber: string;
  address: string;
  isActive: boolean;
}

const store = useStore();
const openModal = ref(false);
const isEditMode = ref(false);
const formData = reactive<Customer>({
  id: '',
  firstName: '',
  lastName: '',
  email: '',
  phoneNumber: '',
  address: '',
  isActive: true,
});

const customers = computed(() => store.state.customers.customers);
const meta = computed(() => store.state.customers.meta);
const currentPage = ref(1);
const perPage = ref(10);

function openCustomerModal(customer: Customer | null = null) {
  isEditMode.value = !!customer;
  if (customer) {
    Object.assign(formData, customer);
  } else {
    Object.assign(formData, {
      id: '',
      firstName: '',
      lastName: '',
      email: '',
      phoneNumber: '',
      address: '',
      isActive: true,
    });
  }
  openModal.value = true;
}

function submitForm() {
  if (isEditMode.value) {
    store.dispatch('customers/updateCustomer', formData);
  } else {
    store.dispatch('customers/createCustomer', formData);
  }
  openModal.value = false;
}

function deleteCustomer(customerId: string) {
  store.dispatch('customers/deleteCustomer', customerId);
}

function handleCreateCustomerClick() {
  openCustomerModal();
}

function handlePageChange(page: number) {
  currentPage.value = page;
  store.dispatch('customers/fetchCustomers', { page: currentPage.value, perPage: perPage.value });
}

onMounted(() => {
  store.dispatch('customers/fetchCustomers', { page: currentPage.value, perPage: perPage.value });
});
</script>

<template>
  <h3 class="text-3xl font-medium text-gray-700">Customer List</h3>

  <div class="mt-4">
    <!-- Create Customer Button -->
    <button @click="handleCreateCustomerClick" class="px-4 py-2 font-medium tracking-wide text-white capitalize transition-colors duration-200 transform bg-indigo-600 rounded-md hover:bg-indigo-500 focus:outline-none focus:bg-indigo-500">
      Create Customer
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
                <th class="px-6 py-3 text-xs font-medium leading-4 tracking-wider text-left text-gray-500 uppercase bg-gray-100 border-b border-gray-200">Address</th>
                <th class="px-6 py-3 bg-gray-100 border-b border-gray-200"></th>
              </tr>
            </thead>

            <tbody class="bg-white">
              <tr v-for="(c, index) in customers" :key="index">
                <td class="px-6 py-4 border-b border-gray-200 whitespace-nowrap">{{ c.firstName }}</td>
                <td class="px-6 py-4 border-b border-gray-200 whitespace-nowrap">{{ c.lastName }}</td>
                <td class="px-6 py-4 border-b border-gray-200 whitespace-nowrap">{{ c.email }}</td>
                <td class="px-6 py-4 border-b border-gray-200 whitespace-nowrap">{{ c.phoneNumber }}</td>
                <td class="px-6 py-4 border-b border-gray-200 whitespace-nowrap">{{ c.address }}</td>

                <td class="px-6 py-4 text-sm font-medium leading-5 text-right border-b border-gray-200 whitespace-nowrap">
                  <a href="#" @click="openCustomerModal(c)" class="text-indigo-600 hover:text-indigo-900">Edit</a>
                  <a href="#" @click="deleteCustomer(c.id)" class="text-red-600 hover:text-red-900 ml-4">Delete</a>
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
            <p class="text-2xl font-bold">{{ isEditMode ? 'Edit Customer' : 'Create Customer' }}</p>
            <div class="z-50 cursor-pointer modal-close" @click="openModal = false">
              <svg class="text-black fill-current" xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 18 18"><path d="M14.53 4.53l-1.06-1.06L9 7.94 4.53 3.47 3.47 4.53 7.94 9l-4.47 4.47 1.06 1.06L9 10.06l4.47 4.47 1.06-1.06L10.06 9z"/></svg>
            </div>
          </div>

          <!-- Modal Body -->
          <div class="space-y-4">
            <input v-model="formData.firstName" type="text" placeholder="First Name" class="w-full px-4 py-2 border rounded-md">
            <input v-model="formData.lastName" type="text" placeholder="Phone Number" class="w-full px-4 py-2 border rounded-md">
            <input v-model="formData.email" type="email" placeholder="Email" class="w-full px-4 py-2 border rounded-md">
            <input v-model="formData.phoneNumber" type="text" placeholder="Phone Number" class="w-full px-4 py-2 border rounded-md">
            <input v-model="formData.address" type="text" placeholder="Tax PIN" class="w-full px-4 py-2 border rounded-md">
          </div>

          <!-- Modal Footer -->
          <div class="flex items-center justify-between pt-4">
            <button @click="submitForm" class="px-4 py-2 font-medium tracking-wide text-white capitalize transition-colors duration-200 transform bg-indigo-600 rounded-md hover:bg-indigo-500 focus:outline-none focus:bg-indigo-500">
              {{ isEditMode ? 'Update User' : 'Create User' }}
            </button>
            <button @click="openModal = false" class="px-4 py-2 font-medium tracking-wide text-white capitalize transition-colors duration-200 transform bg-red-600 rounded-md hover:bg-red-500 focus:outline-none focus:bg-red-500">
              Cancel
            </button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>


<style scoped>
/* Your styles here */
</style>
