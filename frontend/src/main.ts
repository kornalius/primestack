import { createApp } from 'vue'
import { registerPlugins } from './plugins'
import './feathers'
import './styles/main.sass'
import './shortcuts'
import App from './App.vue'

const app = createApp(App)

registerPlugins(app)

app.mount('#app')
