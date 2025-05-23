import piniaPluginPersistedstate from 'pinia-plugin-persistedstate'
import { createApp } from 'vue'
import { createPinia } from 'pinia'
import '@fortawesome/fontawesome-free/css/all.css'


import App from './App.vue'
import router from './router'

const app = createApp(App)
const pinia=createPinia()

pinia.use(piniaPluginPersistedstate)
// app.use(createPinia())
app.use(router)
app.use(pinia)

app.mount('#app')
