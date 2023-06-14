<template>
  <v-app>
    <v-main>
      <AppBar />
      <router-view />
      <MainManager />
      <MainSnackbar />
    </v-main>
  </v-app>
</template>

<script lang="ts">
import { defineComponent } from 'vue';
import MainManager from './components/manager/MainManager.vue';
import MainSnackbar from './components/snackbars/MainSnackbar.vue';
import AppBar from './components/appBar/AppBar.vue';

export default defineComponent({
  name: 'App',

  components: {
    MainManager,
    MainSnackbar,
    AppBar
  }
});
</script>

<style>
.v-main {
  background-image: url('./assets/background_light.webp') !important;
  background-size: cover;
  max-width: 100%;
  max-height: 100%;
}
</style>
