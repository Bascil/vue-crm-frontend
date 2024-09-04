import { computed } from 'vue';
import { useStore } from 'vuex';

export function useUser() {
  const store = useStore();

  // Retrieve the user role from Vuex state
  const role = computed(() => store.state.auth.role); // Adjust the path based on your Vuex state structure

  return { role };
}