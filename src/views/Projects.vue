<script lang="ts" setup>
import { ref, computed, onMounted } from 'vue';
import { useToast } from 'vue-toastification';
const toast = useToast();
import { useStore } from 'vuex';

interface Project {
  id?: string;
  name: string;
  description: string;
  status: string;
  startDate: string;
  endDate: string;
}

const store = useStore();
const currentPage = ref(1);
const perPage = ref(10);
const openModal = ref(false);
const isEditMode = ref(false);
const formData = ref<Project>({
  name: '',
  description: '',
  status: 'planning',
  startDate: '',
  endDate: '',
});

const projects = computed(() => store.state.projects.projects);
const meta = computed(() => store.state.projects.meta);

function openProjectModal(project?: Project | null) {
  formData.value = project ? { ...project } : {
    name: '',
    description: '',
    status: 'planning',
    startDate: '',
    endDate: '',
  };
  isEditMode.value = !!project;
  openModal.value = true;
}

function submitForm() {
  const { id,...data } = formData.value;

  // Format dates to ISO-8601
  if (data.startDate) data.startDate = new Date(data.startDate).toISOString();
  if (data.endDate) data.endDate = new Date(data.endDate).toISOString();

  const action = isEditMode.value
    ? store.dispatch('projects/updateProject', formData.value)
    : store.dispatch('projects/createProject', data);

  action
    .then((response) => {
      if (response && response.status >= 400) {
        const errorMessage = Array.isArray(response.data?.message) && response.data.message.length > 0
          ? response.data.message[0]
          : 'An error occurred';
        toast.error(`Error: ${errorMessage}`);
      } else if (response) {
        toast.success(isEditMode.value ? 'Project updated successfully!' : 'Project created successfully!');
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

function deleteProject(projectId: string) {
  store.dispatch('projects/deleteProject', projectId)
    .then((response) => {
      if (response.error || response.message?.length) {
        const errorMessage = Array.isArray(response.message) && response.message.length > 0
          ? response.message[0]
          : 'An error occurred';
        toast.error(`Error: ${errorMessage}`);
      } else {
        toast.success('Project deleted successfully!');
      }
    })
    .catch((error) => {
      const errorMessage = Array.isArray(error.response?.data?.message) && error.response.data.message.length > 0
        ? error.response.data.message[0]
        : 'An error occurred';
      toast.error(`Error: ${errorMessage}`);
    });
}

function handlePageChange(page: number) {
  currentPage.value = page;
  store.dispatch('projects/fetchProjects', { page: currentPage.value, perPage: perPage.value });
}

onMounted(() => {
  store.dispatch('projects/fetchProjects', { page: currentPage.value, perPage: perPage.value });
});
</script>

<template>
    <h3 class="text-3xl font-medium text-gray-700">Projects List</h3>
  
    <div class="mt-4">
      <!-- Create Project Button -->
      <button @click="openProjectModal()" class="px-4 py-2 font-medium tracking-wide text-white capitalize transition-colors duration-200 transform bg-indigo-600 rounded-md hover:bg-indigo-500 focus:outline-none focus:bg-indigo-500">
        Create Project
      </button>
  
      <div class="flex flex-col mt-6">
        <div class="py-2 -my-2 overflow-x-auto sm:-mx-6 sm:px-6 lg:-mx-8 lg:px-8">
          <div class="inline-block min-w-full overflow-hidden align-middle border-b border-gray-200 shadow sm:rounded-lg">
            <table class="min-w-full">
              <thead>
                <tr>
                  <th class="px-6 py-3 text-xs font-medium leading-4 tracking-wider text-left text-gray-500 uppercase bg-gray-100 border-b border-gray-200">Name</th>
                  <th class="px-6 py-3 text-xs font-medium leading-4 tracking-wider text-left text-gray-500 uppercase bg-gray-100 border-b border-gray-200">Status</th>
                  <th class="px-6 py-3 text-xs font-medium leading-4 tracking-wider text-left text-gray-500 uppercase bg-gray-100 border-b border-gray-200">Start Date</th>
                  <th class="px-6 py-3 text-xs font-medium leading-4 tracking-wider text-left text-gray-500 uppercase bg-gray-100 border-b border-gray-200">End Date</th>
                  <th class="px-6 py-3 bg-gray-100 border-b border-gray-200"></th>
                </tr>
              </thead>
  
              <tbody class="bg-white">
                <tr v-for="(project, index) in projects" :key="index">
                  <td class="px-6 py-4 border-b border-gray-200 whitespace-nowrap">{{ project.name }}</td>
                  <td class="px-6 py-4 border-b border-gray-200 whitespace-nowrap">{{ project.status }}</td>
                  <td class="px-6 py-4 border-b border-gray-200 whitespace-nowrap">{{ new Date(project.startDate).toLocaleDateString() }}</td>
                  <td class="px-6 py-4 border-b border-gray-200 whitespace-nowrap">{{ new Date(project.endDate).toLocaleDateString() }}</td>
  
                  <td class="px-6 py-4 text-sm font-medium leading-5 text-right border-b border-gray-200 whitespace-nowrap">
                    <a href="#" @click="() => openProjectModal(project)" class="text-indigo-600 hover:text-indigo-900">Edit</a>
                    <a href="#" @click="() => deleteProject(project.id)" class="text-red-600 hover:text-red-900 ml-4">Delete</a>
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
  
    <!-- Modal for Creating/Editing Project -->
    <div v-if="openModal" class="fixed inset-0 z-50 flex items-center justify-center p-4 bg-gray-800 bg-opacity-50">
      <div class="bg-white p-6 rounded-md shadow-md">
        <!-- Modal Header -->
        <div class="flex items-center justify-between">
          <h3 class="text-lg font-medium text-gray-900">{{ isEditMode ? 'Edit Project' : 'Create Project' }}</h3>
          <button @click="openModal = false" class="text-gray-500 hover:text-gray-700">
            <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"/></svg>
          </button>
        </div>
  
        <!-- Modal Body -->
        <div class="mt-4">
          <input v-model="formData.name" type="text" placeholder="Project Name" class="w-full px-4 py-2 mb-2 border rounded-md" />
          <textarea v-model="formData.description" placeholder="Project Description" rows="4" class="w-full px-4 py-2 mb-2 border rounded-md"></textarea>
          <div class="mb-4">
  <label for="startDate" class="block text-sm font-medium text-gray-700">Project Start</label>
  <input
    id="startDate"
    v-model="formData.startDate"
    type="date"
    class="w-full px-4 py-2 mb-2 border rounded-md"
  />
</div>

<div class="mb-4">
  <label for="endDate" class="block text-sm font-medium text-gray-700">Project End</label>
  <input
    id="endDate"
    v-model="formData.endDate"
    type="date"
    class="w-full px-4 py-2 mb-2 border rounded-md"
  />
</div>
          <select v-model="formData.status" class="w-full px-4 py-2 mb-2 border rounded-md">
            <option value="planning">Planning</option>
            <option value="in_progress">In Progress</option>
            <option value="completed">Completed</option>
          </select>
        </div>
  
        <!-- Modal Footer -->
        <div class="flex justify-end pt-4 space-x-4">
          <button @click="openModal = false" class="px-4 py-2 text-white bg-gray-500 rounded-md hover:bg-gray-600">Cancel</button>
          <button @click="submitForm" class="px-4 py-2 text-white bg-blue-500 rounded-md hover:bg-blue-600">{{ isEditMode ? 'Update' : 'Create' }}</button>
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
