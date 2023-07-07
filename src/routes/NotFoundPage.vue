<template>
  <div id="notfound-page">
    <v-card
      class="mx-auto px-6 py-8"
      width="500"
    >
      <v-card-item>
        <v-card-title>
          <h1 class="text-center mb-4">
            {{ $t('404.title') }}
          </h1>
        </v-card-title>
        <v-card-subtitle>
          <h2 class="text-center">
            {{ $t('404.message') }}
          </h2>
        </v-card-subtitle>
      </v-card-item>
      <v-card-actions>
        <v-btn
          block
          class="mt-2"
          variant="elevated"
          color="primary"
          size="x-large"
          to="/"
        >
          {{ $t('404.go-home') }}
        </v-btn>
      </v-card-actions>
    </v-card>
  </div>
</template>

<script lang="ts">
import { defineComponent } from 'vue';

export default defineComponent({
});
</script>

<style scoped>
#notfound-page {
    display: flex;
    vertical-align: middle;
    height: 100%;
}

#notfound-page>div {
    margin: auto;
}
</style>
