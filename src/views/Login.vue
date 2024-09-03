<script setup lang="ts">
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { ENDPOINTS } from '@/config/api'
import api from '@/config/axios'
import axios from 'axios'

const router = useRouter()
const email = ref('')
const password = ref('')
const errorMessage = ref('')

async function login() {
  try {
    const response = await api.post(ENDPOINTS.LOGIN, {
      email: email.value,
      password: password.value,
    })

    // Store the token in localStorage
    localStorage.setItem('access_token', response.data.data.access_token)
    // Redirect to dashboard
    router.push('/dashboard')
  } catch (error) {
    if (axios.isAxiosError(error) && error.response) {
      // Handle the specific error structure
      const { message, statusCode } = error.response.data
      errorMessage.value = message || 'Login failed. Please try again.'
      console.error(`Login error: ${message} (Status code: ${statusCode})`)
    } else {
      console.error('Login error:', error)
      errorMessage.value = 'An error occurred. Please try again later.'
    }
  }
}
</script>

<template>
  <div class="flex items-center justify-center h-screen px-6 bg-gray-200">
    <div class="w-full max-w-sm p-6 bg-white rounded-md shadow-md">
      <div class="flex items-center justify-center">
        <svg
          class="w-10 h-10"
          viewBox="0 0 512 512"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
        </svg>
        <span class="text-2xl font-semibold text-gray-700">Sign In</span>
      </div>
      <form class="mt-4" @submit.prevent="login">
        <label class="block">
          <span class="text-sm text-gray-700">Email</span>
          <input
            v-model="email"
            type="email"
            required
            class="block w-full mt-1 border-gray-200 rounded-md focus:border-indigo-600 focus:ring focus:ring-opacity-40 focus:ring-indigo-500"
          >
        </label>
        <label class="block mt-3">
          <span class="text-sm text-gray-700">Password</span>
          <input
            v-model="password"
            type="password"
            required
            class="block w-full mt-1 border-gray-200 rounded-md focus:border-indigo-600 focus:ring focus:ring-opacity-40 focus:ring-indigo-500"
          >
        </label>
        <div v-if="errorMessage" class="mt-3 text-red-600 text-sm">
          {{ errorMessage }}
        </div>
        <div class="flex items-center justify-between mt-4">
          <div>
            <label class="inline-flex items-center">
              <input type="checkbox" class="text-indigo-600 border-gray-200 rounded-md focus:border-indigo-600 focus:ring focus:ring-opacity-40 focus:ring-indigo-500">
              <span class="mx-2 text-sm text-gray-600">Remember me</span>
            </label>
          </div>
          <div>
            <a
              class="block text-sm text-indigo-700 fontme hover:underline"
              href="#"
            >Forgot your password?</a>
          </div>
        </div>
        <div class="mt-6">
          <button
            type="submit"
            class="w-full px-4 py-2 text-sm text-center text-white bg-indigo-600 rounded-md focus:outline-none hover:bg-indigo-500"
          >
            Sign in
          </button>
        </div>
      </form>
    </div>
  </div>
</template>