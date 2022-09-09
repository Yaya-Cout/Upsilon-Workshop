<template>
  <v-app>
    <ToolbarComponent />
    <v-main>
      <router-view />
    </v-main>
  </v-app>
</template>

<script>
import ToolbarComponent from './components/ToolbarComponent.vue';

export default {
    name: "App",
    components: { ToolbarComponent },
    data: () => ({
    //
    })
}
</script>
