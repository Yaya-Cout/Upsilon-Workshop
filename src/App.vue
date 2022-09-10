<template>
  <v-app>
    <!-- <v-navigation-drawer app> -->
    <!-- -->
    <!-- </v-navigation-drawer> -->

    <ToolbarComponent app />

    <!-- Sizes your content based upon application components -->
    <v-main>
      <!-- Provides the application the proper gutter -->
      <v-container fluid>
        <router-view />
      </v-container>
    </v-main>

    <v-footer app>
    <!-- -->
    </v-footer>
  </v-app>
</template>

<script>
import ToolbarComponent from './components/ToolbarComponent.vue';

export default {
    name: "App",
    components: { ToolbarComponent },
    data: () => ({})
}
</script>
