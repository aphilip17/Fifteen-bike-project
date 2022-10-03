import { createApp } from 'vue';
import App from './App.vue';
/* @ts-ignore */
import vuetify from './plugins/vuetify'; /* XXX: We should add types */
import mitt from 'eventemitter3';
import "./assets/style.css";

const app = createApp(App)
const emitter = new mitt();
app.provide('busEvent', emitter);
app.use(vuetify).mount('#app')
