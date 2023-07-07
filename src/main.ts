import messages from "@intlify/unplugin-vue-i18n/messages";
import { createApp } from 'vue';
import { createI18n } from 'vue-i18n';
import { createRouter, createWebHistory } from "vue-router";
import App from './App.vue';
import vuetify from './plugins/vuetify';
import pinia from './plugins/pinia';
import { loadFonts } from './plugins/webfontloader';
import AboutPage from './routes/AboutPage.vue';
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
    { path: '/', component: Home, name: "home", meta: { title: "Home" } },
    { path: '/about', component: AboutPage, name: "about", meta: { title: "About" } },
    { path: '/create', component: Create, name: "create", meta: { title: "Create" } },
    { path: '/calculator', component: Calculator, name: "calculator", meta: { title: "Calculator" } },
    { path: '/edit/:uuid', component: Editor, name: "edit", meta: { title: "Editor" } },
    { path: '/search', component: Search, name: "search", meta: { title: "Search" } },
    { path: '/view/:uuid', component: Viewer, name: "view", meta: { title: "Viewer" } },
    { path: '/login', component: Login, name: "login", meta: { title: "Login" } },
    { path: '/register', component: Register, name: "register", meta: { title: "Register" } },
    { path: '/user/:username', component: User, name: "user", meta: { title: "User" } },
    { path: '/settings', component: Settings, name: "settings", meta: { title: "Settings" } },
    { path: '/:pathMatch(.*)*', component: NotFound, name: "notfound", meta: { title: "Not Found" } },
  ]
})

router.beforeEach((to, from, next) => {
  let title = ""
  if (to.meta.title && typeof to.meta.title === "string") {
    title = to.meta.title + " - "
  }
  title += "Upsilon Workshop"
  document.title = title
  next()
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
