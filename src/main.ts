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
import Search from './routes/Search.vue';
import Viewer from './routes/Viewer.vue';

loadFonts()

const router = createRouter({
  history: createWebHistory(),
  routes: [
    { path: '/', name: 'Home', component: Home },
    { path: '/about', name: 'About', component: About },
    { path: '/edit', name: 'Editor', component: Editor },
    { path: '/search', name: 'Search', component: Search },
    { path: '/view', name: 'View', component: Viewer },
  ]
})

const i18n = createI18n({
  globalInjection: true,
  locale: "en",
  fallbackLocale: "en",
  availableLocales: ["en", "fr"],
  messages: messages,
});

console.log(i18n)

createApp(App)
  .use(vuetify)
  .use(i18n)
  .use(router)
  .mount('#app')
