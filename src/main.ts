import { createApp } from 'vue';
import { App } from './app';
import router from '@/router';
import store from './store';
import './assets/main.scss';

const app = createApp(App);

app.use(router).use(store).mount('#app');
