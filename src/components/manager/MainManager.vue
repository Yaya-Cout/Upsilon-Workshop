<!-- This manager includes all the other managers -->
<template>
  <CalculatorManager />
  <ShowDeleteConfirmManager />
</template>

<script lang="ts">
import { defineComponent } from 'vue';
import CalculatorManager from './CalculatorManager.vue';
import ShowDeleteConfirmManager from './ShowDeleteConfirmManager.vue';

export default defineComponent({
  components: {
    CalculatorManager,
    ShowDeleteConfirmManager,
  }
});
</script>

<style scoped></style>
