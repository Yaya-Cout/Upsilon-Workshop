<template>
  <v-app>
    <v-main>
      <v-app-bar elevation="5">
        <ProgressbarComponent />
        <v-app-bar-title>
          <router-link
            to="/"
            class="home-link"
          >
            Upsilon Workshop
          </router-link>
        </v-app-bar-title>
        <v-btn
          class="mx-2"
          to="/search"
        >
          {{ $t('navbar.explore') }}
        </v-btn>
        <v-btn
          class="mx-2"
          to="/edit"
        >
          {{ $t('navbar.start') }}
        </v-btn>
        <v-btn
          class="mx-2"
          to="/calculator"
        >
          {{ $t('navbar.calculator') }}
        </v-btn>
        <div v-if="!api.LOGGED_IN">
          <v-btn
            class="mx-2"
            to="/login"
          >
            {{ $t('navbar.login') }}
          </v-btn>
          <v-btn
            class="mx-2"
            variant="outlined"
            to="/register"
          >
            {{ $t('navbar.signup') }}
          </v-btn>
        </div>
        <div v-else>
          <v-btn
            class="mx-2"
            variant="outlined"
            to="/login"
            @click="api.logout()"
          >
            {{ $t('navbar.logout') }}
          </v-btn>
        </div>
      </v-app-bar>
      <router-view />
      <MainManager />
      <MainSnackbar />
    </v-main>
  </v-app>
</template>

<script lang="ts">
import { defineComponent } from 'vue';
import { useAPIStore } from './stores/api';
import MainManager from './components/manager/MainManager.vue';
import MainSnackbar from './components/snackbars/MainSnackbar.vue';
import ProgressbarComponent from './components/ProgressbarComponent.vue';

export default defineComponent({
  name: 'App',

  components: {
    MainManager,
    MainSnackbar,
    ProgressbarComponent
  },
  data() {
    return {
      api: useAPIStore().api,
    };
  },
});
</script>

<style>
.v-main {
  background-image: url('./assets/background_light.webp') !important;
  background-size: cover;
}
</style>

<style scoped>
.home-link {
  color: var(--v-primary-base);
  text-decoration: none;
}
</style>
