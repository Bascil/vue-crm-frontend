import type { RouteRecordRaw } from 'vue-router'
import { createRouter, createWebHistory } from 'vue-router'

import Dashboard from './views/Dashboard.vue'
import Users from './views/Users.vue'
import Login from './views/Login.vue'
import Roles from './views/Roles.vue'
import Profile from './views/Profile.vue'
import Customers from './views/Customers.vue'
import Leads from './views/Leads.vue'
import Tasks from './views/Tasks.vue'
import Projects from './views/Projects.vue'
import { useStore } from 'vuex'

declare module 'vue-router' {
  interface RouteMeta {
    requiresAuth?: boolean
    allowedRoles?: string[]
  }
}
const routes: RouteRecordRaw[] = [
  {
    path: '/',
    name: 'Login',
    component: Login,
    meta: { layout: 'empty' },
  },
  {
    path: '/dashboard',
    name: 'Dashboard',
    component: Dashboard,
    meta: { requiresAuth: true},
  },
  {
    path: '/users',
    name: 'Users',
    component: Users,
  },
  {
    path: '/roles',
    name: 'Roles',
    component: Roles,
  },
  {
    path: '/customers',
    name: 'Customers',
    component: Customers,
  },
  {
    path: '/leads',
    name: 'Leads',
    component: Leads,
  },
  {
    path: '/projects',
    name: 'Projects',
    component: Projects,
  },
  {
    path: '/tasks',
    name: 'Tasks',
    component: Tasks,
  },
  {
    path: '/profile',
    name: 'Profile',
    component: Profile,
  },
]

const router = createRouter({
  history: createWebHistory(),
  routes,
})

// Global navigation guard
router.beforeEach(async (to, from, next) => {
  const store = useStore()

  const isAuthenticated = store.getters['auth/isAuthenticated']
  const userRole = store.getters['auth/getRole']

  console.log('User Role:', userRole) // Debugging output

  // Check if route requires authentication
  if (to.meta.requiresAuth) {
    if (!isAuthenticated) {
      // Redirect to login if not authenticated
      next({ name: 'Login' })
    } else if (to.meta.allowedRoles && !to.meta.allowedRoles.includes(userRole)) {
      // Redirect to a "not authorized" page or handle unauthorized access
      next({ name: 'Login' })
    } else {
      // Proceed to route
      next()
    }
  } else {
    // Proceed to route if no authentication required
    next()
  }
})

export default router
