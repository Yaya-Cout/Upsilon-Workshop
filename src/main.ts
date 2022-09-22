import messages from "@intlify/unplugin-vue-i18n/messages";
import { createApp } from 'vue';
import { createI18n } from 'vue-i18n';
import App from './App.vue';
import vuetify from './plugins/vuetify';
import { loadFonts } from './plugins/webfontloader';

loadFonts()

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
  .mount('#app')
