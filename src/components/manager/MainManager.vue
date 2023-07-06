<!-- This manager includes all the other managers -->
<template>
  <CalculatorManager />
  <ShowDeleteConfirmManager />
</template>

<script setup lang="ts">
import CalculatorManager from './CalculatorManager.vue';
import ShowDeleteConfirmManager from './ShowDeleteConfirmManager.vue';
</script>

<style scoped></style>
