import messages from "@intlify/unplugin-vue-i18n/messages";
import { createApp } from 'vue';
import { createI18n } from 'vue-i18n';
import { createRouter, createWebHistory } from "vue-router";
import App from './App.vue';
import vuetify from './plugins/vuetify';
import pinia from './plugins/pinia';
import { loadFonts } from './plugins/webfontloader';
import AboutPage from './routes/AboutPage.vue';
import CalculatorPage from './routes/CalculatorPage.vue';
import CreatePage from './routes/CreatePage.vue';
import EditorPage from './routes/EditorPage.vue';
import HomePage from './routes/HomePage.vue';
import LoginPage from './routes/LoginPage.vue';
import NotFoundPage from './routes/NotFoundPage.vue'
import RegisterPage from './routes/RegisterPage.vue';
import SearchPage from './routes/SearchPage.vue';
import SettingsPage from './routes/SettingsPage.vue';
import UserPage from './routes/UserPage.vue';
import ViewerPage from './routes/ViewerPage.vue';

loadFonts()

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL || "/"),
  routes: [
    { path: '/', component: HomePage, name: "home", meta: { title: "Home" } },
    { path: '/about', component: AboutPage, name: "about", meta: { title: "About" } },
    { path: '/create', component: CreatePage, name: "create", meta: { title: "Create" } },
    { path: '/calculator', component: CalculatorPage, name: "calculator", meta: { title: "Calculator" } },
    { path: '/edit/:uuid', component: EditorPage, name: "edit", meta: { title: "Editor" } },
    { path: '/search', component: SearchPage, name: "search", meta: { title: "Search" } },
    { path: '/view/:uuid', component: ViewerPage, name: "view", meta: { title: "Viewer" } },
    { path: '/login', component: LoginPage, name: "login", meta: { title: "Login" } },
    { path: '/register', component: RegisterPage, name: "register", meta: { title: "Register" } },
    { path: '/user/:username', component: UserPage, name: "user", meta: { title: "User" } },
    { path: '/settings', component: SettingsPage, name: "settings", meta: { title: "Settings" } },
    { path: '/:pathMatch(.*)*', component: NotFoundPage, name: "notfound", meta: { title: "Not Found" } },
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
