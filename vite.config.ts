import vue from '@vitejs/plugin-vue';
import { defineConfig } from 'vite';

import VueI18nPlugin from "@intlify/unplugin-vue-i18n/vite";

//@ts-ignore
import path from "node:path";
//@ts-ignore
import { fileURLToPath } from "node:url";

// https://github.com/vuetifyjs/vuetify-loader/tree/next/packages/vite-plugin
import vuetify from 'vite-plugin-vuetify';
// https://vitejs.dev/config/
export default defineConfig({
	plugins: [
		vue(),
		vuetify({ autoImport: true }),
		VueI18nPlugin({
			//@ts-ignore
			include: path.resolve(__dirname, './src/locales/**'),
		})
	], resolve: {
		alias: {
			'@': fileURLToPath(new URL('./src', import.meta.url))
		}
	}
})
