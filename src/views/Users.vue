<script lang="ts" setup>
import { ref, reactive, computed, onMounted, watch } from 'vue';
import { useStore } from 'vuex';
import { useToast } from 'vue-toastification';
import { useRoute } from 'vue-router';
const toast = useToast();


const route = useRoute();

// Define types
interface User {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  phoneNumber: string;
  taxPin: string;
  password: string;
  roleId: string;
}

const store = useStore();
const openModal = ref(false);
const isEditMode = ref(false);
const formData = reactive<User>({
  id: '',
  firstName: '',
  lastName: '',
  email: '',
  phoneNumber: '',
  taxPin: '',
  password: '',
  roleId: ''
});

const users = computed(() => store.state.users.users);
const roles = computed(() => store.state.roles.roles);
const meta = computed(() => store.state.users.meta);
const currentPage = ref(1);
const perPage = ref(10);

function openUserModal(user: User | null = null) {
  isEditMode.value = !!user;
  if (user) {
    Object.assign(formData, user);
  } else {
    Object.assign(formData, {
      id: '',
      firstName: '',
      lastName: '',
      email: '',
      phoneNumber: '',
      taxPin: '',
      password: '',
      roleId: ''
    });
  }
  openModal.value = true;
}
function submitForm() {
  const { ...data } = formData; 

  const action = isEditMode.value
    ? store.dispatch('users/updateUser', formData) 
    : store.dispatch('users/createUser', data);

  action
    .then((response) => {
      if (response && response.status >= 400) {
        const errorMessage = Array.isArray(response.data?.message) && response.data.message.length > 0
          ? response.data.message[0]
          : 'An error occurred';
        toast.error(`Error: ${errorMessage}`);
      } else if (response) {
        toast.success(isEditMode.value ? 'User updated successfully!' : 'User created successfully!');
        openModal.value = false;
      } else {
        toast.error('Unexpected error occurred.');
      }
    })
    .catch((error) => {
      const errorMessage = error.response?.data?.message?.[0] || 'An error occurred';
      toast.error(`Error: ${errorMessage}`);
    });
}

function deleteUser(projectId: string) {
  store.dispatch('users/deleteUser', projectId)
    .then((response) => {
      if (response.error || response.message?.length) {
        const errorMessage = Array.isArray(response.message) && response.message.length > 0
          ? response.message[0]
          : 'An error occurred';
        toast.error(`Error: ${errorMessage}`);
      } else {
        toast.success('User deleted successfully!');
      }
    })
    .catch((error) => {
      const errorMessage = Array.isArray(error.response?.data?.message) && error.response.data.message.length > 0
        ? error.response.data.message[0]
        : 'An error occurred';
      toast.error(`Error: ${errorMessage}`);
    });
}

function handleCreateUserClick() {
  openUserModal();
}

function handlePageChange(page: number) {
  currentPage.value = page;
  store.dispatch('users/fetchUsers', { page: currentPage.value, perPage: perPage.value });
  store.dispatch('roles/fetchRoles', {page:1, perPage:10}); 
}

onMounted(() => {
  store.dispatch('users/fetchUsers', { page: currentPage.value, perPage: perPage.value });
  store.dispatch('roles/fetchRoles', {page:1, perPage:10}); 
});

watch(() => route.path, () => {
  store.dispatch('users/fetchUsers', { page: currentPage.value, perPage: perPage.value });
  store.dispatch('roles/fetchRoles', {page:1, perPage:10});
});
</script>

<template>
  <h3 class="text-3xl font-medium text-gray-700">User List</h3>

  <div class="mt-4">
    <!-- Create User Button -->
    <button @click="handleCreateUserClick" class="px-4 py-2 font-medium tracking-wide text-white capitalize transition-colors duration-200 transform bg-indigo-600 rounded-md hover:bg-indigo-500 focus:outline-none focus:bg-indigo-500">
      Create User
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
                <th class="px-6 py-3 text-xs font-medium leading-4 tracking-wider text-left text-gray-500 uppercase bg-gray-100 border-b border-gray-200">Tax PIN</th>
                <th class="px-6 py-3 bg-gray-100 border-b border-gray-200"></th>
              </tr>
            </thead>

            <tbody class="bg-white">
              <tr v-for="(u, index) in users" :key="index">
                <td class="px-6 py-4 border-b border-gray-200 whitespace-nowrap">{{ u.firstName }}</td>
                <td class="px-6 py-4 border-b border-gray-200 whitespace-nowrap">{{ u.lastName }}</td>
                <td class="px-6 py-4 border-b border-gray-200 whitespace-nowrap">{{ u.email }}</td>
                <td class="px-6 py-4 border-b border-gray-200 whitespace-nowrap">{{ u.phoneNumber }}</td>
                <td class="px-6 py-4 border-b border-gray-200 whitespace-nowrap">{{ u.taxPin }}</td>

                <td class="px-6 py-4 text-sm font-medium leading-5 text-right border-b border-gray-200 whitespace-nowrap">
                  <a href="#" @click="openUserModal(u)" class="text-indigo-600 hover:text-indigo-900">Edit</a>
                  <a href="#" @click="deleteUser(u.id)" class="text-red-600 hover:text-red-900 ml-4">Delete</a>
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
            <p class="text-2xl font-bold">{{ isEditMode ? 'Edit User' : 'Create User' }}</p>
            <div class="z-50 cursor-pointer modal-close" @click="openModal = false">
              <svg class="text-black fill-current" xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 18 18"><path d="M14.53 4.53l-1.06-1.06L9 7.94 4.53 3.47 3.47 4.53 7.94 9l-4.47 4.47 1.06 1.06L9 10.06l4.47 4.47 1.06-1.06L10.06 9z"/></svg>
            </div>
          </div>

          <!-- Modal Body -->
          <div class="space-y-4">
           
            <input v-model="formData.firstName" type="text" placeholder="First Name" class="w-full px-4 py-2 border rounded-md">
            <input v-model="formData.lastName" type="text" placeholder="Last Name" class="w-full px-4 py-2 border rounded-md">
            <input v-model="formData.email" type="email" placeholder="Email" class="w-full px-4 py-2 border rounded-md">
            <input v-model="formData.phoneNumber" type="text" placeholder="Phone Number" class="w-full px-4 py-2 border rounded-md">
            <input v-model="formData.taxPin" type="text" placeholder="Tax PIN" class="w-full px-4 py-2 border rounded-md">
              <!-- Role Dropdown -->
          <select v-model="formData.roleId" class="w-full px-4 py-2 mb-2 border rounded-md">
            <option value="" disabled>Select a Role</option>
            <option v-for="role in roles" :key="role.id" :value="role.id">
              {{ role.name }}
            </option>
          </select>
            <template v-if="!isEditMode">
              <input v-model="formData.password" type="password" placeholder="Password" class="w-full px-4 py-2 border rounded-md">
            </template>
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
