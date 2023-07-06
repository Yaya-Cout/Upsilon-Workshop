<template>
  <v-snackbar v-model="calculatorStore.tooMuchDataError">
    <span>
      {{ $t('snackbar.too-much-data.message') }}
    </span>
    <template #actions>
      <v-btn
        variant="text"
        color=""
        @click="manage()"
      >
        {{ $t('snackbar.too-much-data.manage') }}
      </v-btn>
      <v-btn
        color="error"
        variant="text"
        @click="calculatorStore.tooMuchDataError = false"
      >
        {{ $t('snackbar.close') }}
      </v-btn>
    </template>
  </v-snackbar>
</template>

<script setup lang="ts">
import { useCalculatorStore } from '../../stores/calculator';
import { useRouter } from 'vue-router';

const calculatorStore = useCalculatorStore();
const $router = useRouter();

const manage = () => {
    $router.push({ name: 'calculator' });
}
</script>

<style scoped></style>
