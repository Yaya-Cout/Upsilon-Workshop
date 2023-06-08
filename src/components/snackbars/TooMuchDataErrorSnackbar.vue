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

<script lang="ts">
import { defineComponent } from 'vue';
import { useCalculatorStore } from '../../stores/calculator';

export default defineComponent({
    data() {
        return {
            calculatorStore: useCalculatorStore(),
        };
    },
    methods: {
        manage() {
            this.$router.push({ name: 'calculator' });
        }
    },
});
</script>

<style scoped></style>
