import { createApp } from 'vue'
import App from './App.vue'
import router from './router'
import i18n from './i18n'
import vuetify from './plugins/vuetify'
import { loadFonts } from './plugins/webfontloader'
import store from './store'

loadFonts()

createApp(App)
  .use(store)
  .use(router)
  .use(vuetify)
  .use(i18n)
  .mount('#app')
