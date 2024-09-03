import { createApp } from 'vue'
import App from './App.vue'
import router from './router'
import './assets/main.css'
import store from '@/store';

import DashboardLayout from './components/DashboardLayout.vue'
import EmptyLayout from './components/EmptyLayout.vue'

const app = createApp(App)

app.component('DefaultLayout', DashboardLayout)
app.component('EmptyLayout', EmptyLayout)

app.use(store);
app.use(router)
app.mount('#app')
