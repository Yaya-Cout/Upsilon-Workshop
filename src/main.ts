import messages from "@intlify/unplugin-vue-i18n/messages";
import { createApp } from 'vue';
import { createI18n } from 'vue-i18n';
import { createRouter, createWebHistory } from "vue-router";
import App from './App.vue';
import vuetify from './plugins/vuetify';
import pinia from './plugins/pinia';
import { loadFonts } from './plugins/webfontloader';
import About from './routes/About.vue';
import Calculator from './routes/Calculator.vue';
import Create from './routes/Create.vue';
import Editor from './routes/Editor.vue';
import Home from './routes/Home.vue';
import Login from './routes/Login.vue';
import NotFound from './routes/NotFound.vue'
import Register from './routes/Register.vue';
import Search from './routes/Search.vue';
import Settings from './routes/Settings.vue';
import User from './routes/User.vue';
import Viewer from './routes/Viewer.vue';

loadFonts()

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL || "/"),
  routes: [
    { path: '/', component: Home, name: "home" },
    { path: '/about', component: About, name: "about" },
    { path: '/create', component: Create, name: "create" },
    { path: '/calculator', component: Calculator, name: "calculator" },
    { path: '/edit/:uuid', component: Editor, name: "edit" },
    { path: '/search', component: Search, name: "search" },
    { path: '/view/:uuid', component: Viewer, name: "view" },
    { path: '/login', component: Login, name: "login" },
    { path: '/register', component: Register, name: "register" },
    { path: '/user/:username', component: User, name: "user" },
    { path: '/settings', component: Settings, name: "settings" },
    { path: '/:pathMatch(.*)*', component: NotFound, name: "notfound" },
  ]
})

const i18n = createI18n({
  globalInjection: true,
  locale: navigator.language.split("-")[0],
  fallbackLocale: "en",
  availableLocales: ["en", "fr"],
  messages: messages,
});


createApp(App)
  .use(vuetify)
  .use(pinia)
  .use(i18n)
  .use(router)
  .mount('#app')
