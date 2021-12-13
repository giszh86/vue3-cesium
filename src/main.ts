import { createApp } from 'vue'
import App from './App.vue'
import router from './router'
import store, { globalStoreKey } from './store';

const app = createApp(App)
app.use(store, globalStoreKey);
app.use(router)
app.mount('#app')
