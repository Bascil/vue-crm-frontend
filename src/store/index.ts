import { createStore } from 'vuex';
import users from '@/store/modules/users';
import roles from './modules/roles';

export interface RootState {
  // Define your root state types here
}

const store = createStore<RootState>({
  modules: {
    users,
    roles
  }
});

export default store;
