<script setup lang="ts">
import { ref, computed, onMounted } from 'vue';
import { useStore } from 'vuex';
import { useToast } from 'vue-toastification';
import TagsInput from '../components/TagsInput.vue'

const toast = useToast();
const store = useStore();
const openModal = ref(false);
const isEditMode = ref(false);

// Pagination state
const currentPage = ref(1);
const perPage = ref(10);

interface FormData {
  id: string | null;
  name: string;
  permissions: string[];
}

const formData = ref<FormData>({
  id: null,
  name: '',
  permissions: [],
});

const roles = computed(() => store.state.roles.roles);

const openRoleModal = (role: FormData | null = null) => {
  isEditMode.value = !!role;
  if (role) {
    formData.value = {
      id: role.id,
      name: role.name,
      permissions: [...role.permissions], // Spread the array to avoid reference issues
    };
  } else {
    formData.value = {
      id: null,
      name: '',
      permissions: [],
    };
  }
  openModal.value = true;
};

function closeRoleModal() {
  openModal.value = false;
}

function submitForm() {
  const data = {
    ...formData.value, // Destructure and spread formData for submission
  };

  const action = isEditMode.value
    ? store.dispatch('roles/updateRole', data)
    : store.dispatch('roles/createRole', data);

  action
    .then((response) => {
      if (response && response.status >= 400) {
        const errorMessage = Array.isArray(response.data?.message) && response.data.message.length > 0
          ? response.data.message[0]
          : 'An error occurred';
        toast.error(`Error: ${errorMessage}`);
      } else if (response) {
        toast.success(isEditMode.value ? 'Role updated successfully!' : 'Role created successfully!');
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

function deleteRole(roleId: string) {
  store.dispatch('roles/deleteRole', roleId)
    .then((response) => {
      if (response.error || response.message?.length) {
        const errorMessage = Array.isArray(response.message) && response.message.length > 0
          ? response.message[0]
          : 'An error occurred';
        toast.error(`Error: ${errorMessage}`);
      } else {
        toast.success('Role deleted successfully!');
      }
    })
    .catch((error) => {
      const errorMessage = Array.isArray(error.response?.data?.message) && error.response.data.message.length > 0
        ? error.response.data.message[0]
        : 'An error occurred';
      toast.error(`Error: ${errorMessage}`);
    });
}

// Fetch roles with pagination on component mount
onMounted(() => {
  store.dispatch('roles/fetchRoles', { page: currentPage.value, perPage: perPage.value });
});

function changePage(page: number) {
  currentPage.value = page;
  store.dispatch('roles/fetchRoles', { page: currentPage.value, perPage: perPage.value });
}
</script>

<template>
  <div>
    <h3 class="text-3xl font-medium text-gray-700">Role List</h3>
    <div class="mt-4">
      <!-- <button
        @click="() => openRoleModal(null)"
        class="px-4 py-2 font-medium tracking-wide text-white capitalize transition-colors duration-200 transform bg-indigo-600 rounded-md hover:bg-indigo-500 focus:outline-none focus:bg-indigo-500"
      >
        Create Role
      </button> -->

      <!-- List of Roles -->
      <div class="mt-6 overflow-x-auto">
        <div class="inline-block min-w-full overflow-hidden align-middle border-b border-gray-200 shadow sm:rounded-lg">
          <table class="min-w-full">
            <thead>
              <tr>
                <th class="px-6 py-3 text-xs font-medium leading-4 tracking-wider text-left text-gray-500 uppercase bg-gray-100 border-b border-gray-200">Role Name</th>
                <th class="px-6 py-3 bg-gray-100 border-b border-gray-200"></th>
              </tr>
            </thead>
            <tbody class="bg-white">
              <tr v-for="role in roles" :key="role.id">
                <td class="px-6 py-4 border-b border-gray-200 whitespace-nowrap">{{ role.name }}</td>
                <td class="px-6 py-4 text-sm font-medium leading-5 text-right border-b border-gray-200 whitespace-nowrap">
                  <button @click="() => openRoleModal(role)" class="px-2 py-1 bg-yellow-500 text-white rounded-md">Edit</button>
                  <button @click="() => deleteRole(role.id)" class="px-2 py-1 bg-red-500 text-white rounded-md ml-2">Delete</button>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>

      <!-- Pagination Controls -->
      <div class="mt-4 flex justify-center">
        <button @click="changePage(currentPage - 1)" :disabled="currentPage === 1" class="px-3 py-1 mx-1 text-gray-700 bg-gray-200 rounded-md hover:bg-gray-300">
          Previous
        </button>
        <button @click="changePage(currentPage + 1)" class="px-3 py-1 mx-1 text-gray-700 bg-gray-200 rounded-md hover:bg-gray-300">
          Next
        </button>
      </div>
    </div>
  </div>

  <!-- Modal for creating/editing role -->
  <div v-if="openModal" class="fixed inset-0 flex items-center justify-center bg-gray-500 bg-opacity-50">
    <div class="bg-white p-6 rounded-md shadow-md md:max-w-md w-full mx-auto">
      <h2 class="text-xl font-bold mb-4">{{ isEditMode ? 'Edit Role' : 'Create Role' }}</h2>
      <form @submit.prevent="submitForm">
        <input v-model="formData.name" type="text" placeholder="Role Name" class="w-full px-4 py-2 border rounded-md mb-4">

        <!-- Permissions Tag Input -->
        <TagsInput v-model:tags="formData.permissions" placeholder="Select Permissions" />

        <div class="flex items-center justify-between mt-4">
          <button type="submit" class="px-4 py-2 font-medium tracking-wide text-white capitalize transition-colors duration-200 transform bg-blue-600 rounded-md hover:bg-blue-500 focus:outline-none focus:bg-blue-500">
            {{ isEditMode ? 'Update Role' : 'Create Role' }}
          </button>
          <button @click="closeRoleModal" class="px-4 py-2 font-medium tracking-wide text-white capitalize transition-colors duration-200 transform bg-gray-600 rounded-md hover:bg-gray-500 focus:outline-none focus:bg-gray-500 ml-2">
            Cancel
          </button>
        </div>
      </form>
    </div>
  </div>
</template>

<style scoped>
.modal {
  display: flex;
  align-items: center;
  justify-content: center;
}

.modal-overlay {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
}

.modal-container {
  max-width: 500px;
}

.modal-close {
  cursor: pointer;
}

.modal-content {
  position: relative;
}
</style>
