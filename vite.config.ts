import VueI18nPlugin from "@intlify/unplugin-vue-i18n/vite";
import vue from '@vitejs/plugin-vue';
import { defineConfig } from 'vite';
import monacoEditorPlugin from 'vite-plugin-monaco-editor';
//@ts-ignore
import path from "node:path";
//@ts-ignore
import { fileURLToPath } from "node:url";
import checker from 'vite-plugin-checker'

// https://github.com/vuetifyjs/vuetify-loader/tree/next/packages/vite-plugin
import vuetify from 'vite-plugin-vuetify';
// https://vitejs.dev/config/
export default defineConfig({
	base: process.env.BASE_URL || "/",
	plugins: [
		//@ts-ignore
		monacoEditorPlugin.default({
			languages: ['python']
		}),
		checker({
			typescript: true,
		}),
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
