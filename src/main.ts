import messages from "@intlify/unplugin-vue-i18n/messages";
import { createApp } from 'vue';
import { createI18n } from 'vue-i18n';
import { createRouter, createWebHistory } from "vue-router";
import App from './App.vue';
import vuetify from './plugins/vuetify';
import { loadFonts } from './plugins/webfontloader';
import About from './routes/About.vue';
import Editor from './routes/Editor.vue';
import Home from './routes/Home.vue';
import Login from './routes/Login.vue';
import Search from './routes/Search.vue';
import Viewer from './routes/Viewer.vue';

loadFonts()

const router = createRouter({
  history: createWebHistory(),
  routes: [
    { path: '/', component: Home },
    { path: '/about', component: About },
    { path: '/edit/:uuid', component: Editor },
    { path: '/search', component: Search },
    { path: '/view/:uuid', component: Viewer },
    { path: '/login', component: Login },
  ]
})

const i18n = createI18n({
  globalInjection: true,
  locale: "en",
  fallbackLocale: "en",
  availableLocales: ["en", "fr"],
  messages: messages,
});


createApp(App)
  .use(vuetify)
  .use(i18n)
  .use(router)
  .mount('#app')
