import { createApp } from 'vue'
import { registerPlugins } from './plugins'
import './feathers'
// import './styles/index.css'
import App from './App.vue'

const app = createApp(App)

registerPlugins(app)

app.mount('#app')
