<!-- This manager includes all the other managers -->
<template>
    <CalculatorManager />
</template>

<script lang="ts">
import { defineComponent } from 'vue';
import CalculatorManager from './CalculatorManager.vue';

export default defineComponent({
    components: {
        CalculatorManager
    }
});
</script>

<style scoped></style>
