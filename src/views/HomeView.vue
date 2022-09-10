<template>
  <div id="app">
    <v-col
      v-for="x in 12"
      :key="x"
      cols="12"
    >
      <v-img
        :src="'https://picsum.photos/1920/1080?random=' + x"
        max-height="600"
      />
    </v-col>
  </div>
</template>

<script>
import { defineComponent } from 'vue';

export default defineComponent({
  name: 'HomeView',

  components: {},
});
</script>
