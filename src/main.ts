import './assets/main.css'
import './assets/index.css'
import './assets/transition.css'

import { createApp } from 'vue'
import { createPinia } from 'pinia'

import AOS from 'aos'
import 'aos/dist/aos.css'
import App from './App.vue'
import router from './router'

const app = createApp(App)

app.use(createPinia())
app.use(router)

AOS.init({
  duration: 1000, // Animation duration in milliseconds
  easing: 'ease-in-out', // Easing function
  once: false, // Whether animation should happen only once
  // Add more options as needed: https://github.com/michalsnik/aos#options
})

app.mount('#app')
