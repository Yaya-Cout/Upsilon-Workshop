<template>
  <div id="app">
    <v-row
      v-for="x in 3"
      :key="x"
    >
      <v-col
        v-for="y in 4"
        :key="y"
        cols="12"
      >
        <v-img
          :src="'https://picsum.photos/1920/1080?random=' + x + y"
          max-height="600"
        />
      </v-col>
    </v-row>
  </div>
</template>

<script>
import { defineComponent } from 'vue';

export default defineComponent({
  name: 'HomeView',

  components: {},
});
</script>
