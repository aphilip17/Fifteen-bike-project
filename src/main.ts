import { createApp } from 'vue';
import App from './App.vue';
/* @ts-ignore */
import vuetify from './plugins/vuetify'; /* XXX: We should add types */

const app = createApp(App)
app.use(vuetify).mount('#app')
