<script setup lang="ts">
import { ref, computed } from 'vue';
import { useRoute } from 'vue-router';
import { useSidebar } from '../composables/useSidebar';
import { useUser } from '../composables/useUser'; // Assuming you have a composable to get the user role

const { isOpen } = useSidebar();
const { role } = useUser(); // Assuming this returns a ComputedRef<string>

// Unwrap role to use its value
const userRole = computed(() => role.value);

const activeClass = ref(
  'bg-gray-600 bg-opacity-25 text-gray-100 border-gray-100'
);
const inactiveClass = ref(
  'border-gray-900 text-gray-500 hover:bg-gray-600 hover:bg-opacity-25 hover:text-gray-100'
);

const hasAccess = (route: string) => {
  const accessibleRoutesForAdmin = ['Dashboard', 'Users', 'Roles', 'Tasks', 'Projects', 'Profile', 'Customers', 'Leads'];
  
  switch (userRole.value) {
    case 'Admin':
    return  accessibleRoutesForAdmin.includes(route);
    case 'Engineer':
      return ['Dashboard', 'Tasks', 'Projects', 'Profile'].includes(route);
    case 'Manager':
      return ['Dashboard', 'Tasks', 'Projects', 'Profile', 'Customers', 'Leads'].includes(route);
    default:
      return false;
  }
};
</script>
<template>
  <div class="flex">
    <!-- Backdrop -->
    <div
      :class="isOpen ? 'block' : 'hidden'"
      class="fixed inset-0 z-20 transition-opacity bg-black opacity-50 lg:hidden"
      @click="isOpen = false"
    />
    <!-- End Backdrop -->

    <div
      :class="isOpen ? 'translate-x-0 ease-out' : '-translate-x-full ease-in'"
      class="fixed inset-y-0 left-0 z-30 w-64 overflow-y-auto transition duration-300 transform bg-gray-900 lg:translate-x-0 lg:static lg:inset-0"
    >
      <div class="flex items-center justify-center mt-8">
        <div class="flex items-center">
          <svg
            class="w-12 h-12"
            viewBox="0 0 512 512"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              d="M364.61 390.213C304.625 450.196 207.37 450.196 147.386 390.213C117.394 360.22 102.398 320.911 102.398 281.6C102.398 242.291 117.394 202.981 147.386 172.989C147.386 230.4 153.6 281.6 230.4 307.2C230.4 256 256 102.4 294.4 76.7999C320 128 334.618 142.997 364.608 172.989C394.601 202.981 409.597 242.291 409.597 281.6C409.597 320.911 394.601 360.22 364.61 390.213Z"
              fill="#4C51BF"
              stroke="#4C51BF"
              stroke-width="2"
              stroke-linecap="round"
              stroke-linejoin="round"
            />
            <path
              d="M201.694 387.105C231.686 417.098 280.312 417.098 310.305 387.105C325.301 372.109 332.8 352.456 332.8 332.8C332.8 313.144 325.301 293.491 310.305 278.495C295.309 263.498 288 256 275.2 230.4C256 243.2 243.201 320 243.201 345.6C201.694 345.6 179.2 332.8 179.2 332.8C179.2 352.456 186.698 372.109 201.694 387.105Z"
              fill="white"
            />
          </svg>

          <span class="mx-2 text-2xl font-semibold text-white">Bingwa CRM</span>
        </div>
      </div>

      <nav class="mt-10">
        <router-link
          v-if="hasAccess('Dashboard')"
          class="flex items-center px-6 py-2 mt-4 duration-200 border-l-4"
          :class="[$route.name === 'Dashboard' ? activeClass : inactiveClass]"
          to="/dashboard"
        >
          <svg
            class="w-5 h-5"
            viewBox="0 0 20 20"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              d="M2 10C2 5.58172 5.58172 2 10 2V10H18C18 14.4183 14.4183 18 10 18C5.58172 18 2 14.4183 2 10Z"
              fill="currentColor"
            />
            <path
              d="M12 2.25195C14.8113 2.97552 17.0245 5.18877 17.748 8.00004H12V2.25195Z"
              fill="currentColor"
            />
          </svg>

          <span class="mx-4">Dashboard</span>
        </router-link>

        <router-link
          v-if="hasAccess('Users')"
          class="flex items-center px-6 py-2 mt-4 duration-200 border-l-4"
          :class="[$route.name === 'Users' ? activeClass : inactiveClass]"
          to="/users"
        >
          <!-- Users SVG -->
          <svg
            class="w-5 h-5"
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 24 24"
            fill="currentColor"
          >
            <path d="M3 6c0-1.11.89-2 2-2s2 .89 2 2-2 2-2 2-2-.89-2-2zm6-2h6c1.1 0 2 .9 2 2s-.9 2-2 2H9c-1.1 0-2-.9-2-2s.9-2 2-2zm10 2c1.1 0 2 .89 2 2s-.9 2-2 2-2-.89-2-2 .9-2 2-2zm-4 2c0-1.1.9-2 2-2s2 .9 2 2-2 2-2 2-2-.9-2-2z"/>
          </svg>

          <span class="mx-4">Users</span>
        </router-link>

        <router-link
          v-if="hasAccess('Roles')"
          class="flex items-center px-6 py-2 mt-4 duration-200 border-l-4"
          :class="[$route.name === 'Roles' ? activeClass : inactiveClass]"
          to="/roles"
        >
          <!-- Roles SVG -->
          <svg
            class="w-5 h-5"
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 24 24"
            fill="currentColor"
          >
            <path d="M3 6c0-1.11.89-2 2-2s2 .89 2 2-2 2-2 2-2-.89-2-2zm6-2h6c1.1 0 2 .9 2 2s-.9 2-2 2H9c-1.1 0-2-.9-2-2s.9-2 2-2zm10 2c1.1 0 2 .89 2 2s-.9 2-2 2-2-.89-2-2 .9-2 2-2zm-4 2c0-1.1.9-2 2-2s2 .9 2 2-2 2-2 2-2-.9-2-2z"/>
          </svg>

          <span class="mx-4">Roles</span>
        </router-link>

        <router-link
          v-if="hasAccess('Tasks')"
          class="flex items-center px-6 py-2 mt-4 duration-200 border-l-4"
          :class="[$route.name === 'Tasks' ? activeClass : inactiveClass]"
          to="/tasks"
        >
          <svg
            class="w-5 h-5"
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 24 24"
            fill="currentColor"
          >
            <path d="M3 12l5 5L22 4"/>
          </svg>

          <span class="mx-4">Tasks</span>
        </router-link>

        <router-link
          v-if="hasAccess('Projects')"
          class="flex items-center px-6 py-2 mt-4 duration-200 border-l-4"
          :class="[$route.name === 'Projects' ? activeClass : inactiveClass]"
          to="/projects"
        >
          <svg
            class="w-5 h-5"
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 24 24"
            fill="currentColor"
          >
            <path d="M12 2L2 7v6l10 5 10-5V7l-10-5z"/>
          </svg>

          <span class="mx-4">Projects</span>
        </router-link>


        <router-link
          v-if="hasAccess('Customers')"
          class="flex items-center px-6 py-2 mt-4 duration-200 border-l-4"
          :class="[$route.name === 'Customers' ? activeClass : inactiveClass]"
          to="/customers"
        >
          <!-- Customers SVG -->
          <svg
            class="w-5 h-5"
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 24 24"
            fill="currentColor"
          >
            <path d="M3 6c0-1.11.89-2 2-2s2 .89 2 2-2 2-2 2-2-.89-2-2zm6-2h6c1.1 0 2 .9 2 2s-.9 2-2 2H9c-1.1 0-2-.9-2-2s.9-2 2-2zm10 2c1.1 0 2 .89 2 2s-.9 2-2 2-2-.89-2-2 .9-2 2-2zm-4 2c0-1.1.9-2 2-2s2 .9 2 2-2 2-2 2-2-.9-2-2z"/>
          </svg>

          <span class="mx-4">Customers</span>
        </router-link>

        <router-link
          v-if="hasAccess('Leads')"
          class="flex items-center px-6 py-2 mt-4 duration-200 border-l-4"
          :class="[$route.name === 'Leads' ? activeClass : inactiveClass]"
          to="/leads"
        >
          <!-- Leads SVG -->
          <svg
            class="w-5 h-5"
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 24 24"
            fill="currentColor"
          >
            <path d="M12 2C7.03 2 3.22 5.48 1.3 10.44A8.01 8.01 0 0 0 4.24 20c1.65 1.83 4.05 3 6.76 3 2.71 0 5.12-1.1 6.71-2.94A8.003 8.003 0 0 0 22 10c0-4.42-3.58-8-8-8zM12 18c-1.82 0-3.49-.65-4.82-1.7C7.66 15.1 8.33 13 10 12c1.76-1.04 4-1.04 5.76 0 1.64 1.05 2.21 3.1 1.58 4.58C15.49 17.35 13.82 18 12 18z"/>
          </svg>

          <span class="mx-4">Leads</span>
        </router-link>

        <!-- <router-link
          v-if="hasAccess('Profile')"
          class="flex items-center px-6 py-2 mt-4 duration-200 border-l-4"
          :class="[$route.name === 'Profile' ? activeClass : inactiveClass]"
          to="/profile"
        >
          <svg
            class="w-5 h-5"
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 24 24"
            fill="currentColor"
          >
            <path d="M12 12c2.76 0 5-2.24 5-5s-2.24-5-5-5-5 2.24-5 5 2.24 5 5 5zm0 2c-3.33 0-10 1.67-10 5v3h20v-3c0-3.33-6.67-5-10-5z"/>
          </svg>

          <span class="mx-4">Profile</span>
        </router-link> -->

      </nav>
    </div>
  </div>
</template>
