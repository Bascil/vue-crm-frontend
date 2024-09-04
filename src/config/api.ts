export const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:8000/api/v1'

export const ENDPOINTS = {
  LOGIN: `${API_BASE_URL}/login`,
  USERS: `${API_BASE_URL}/users`,
  ROLES: `${API_BASE_URL}/roles`,
  PERMISSIONS: `${API_BASE_URL}/permissions`,
  CUSTOMERS: `${API_BASE_URL}/customers`,
  LEADS: `${API_BASE_URL}/leads`,
  PROJECTS: `${API_BASE_URL}/projects`,
  TASKS: `${API_BASE_URL}/tasks`,
}