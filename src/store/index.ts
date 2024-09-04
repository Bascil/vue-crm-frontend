import { createStore } from 'vuex';
import users from '@/store/modules/users';
import roles from './modules/roles';
import customers from './modules/customers';
import leads from './modules/leads';
import projects from './modules/projects';
import tasks from './modules/tasks';
import auth from './modules/auth';

export interface RootState {
  // Define your root state types here
}

const store = createStore<RootState>({
  modules: {
    auth,
    users,
    roles,
    customers,
    leads,
    projects,
    tasks
  }
});

export default store;
