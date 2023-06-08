<template>
  <v-snackbar v-model="calculatorStore.installationSuccess">
    <span>
      {{ $t('snackbar.installation-success') }}
    </span>
    <template #actions>
      <v-btn
        color="success"
        variant="text"
        @click="calculatorStore.installationSuccess = false"
      >
        {{ $t('snackbar.close') }}
      </v-btn>
    </template>
  </v-snackbar>
</template>

<script lang="ts">
import { defineComponent } from 'vue';
import { useCalculatorStore } from '../../stores/calculator';

export default defineComponent({
    data() {
        return {
            calculatorStore: useCalculatorStore(),
        };
    },
});
</script>

<style scoped></style>
