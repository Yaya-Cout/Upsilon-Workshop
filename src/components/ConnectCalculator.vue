<template>
  <div @click="connect">
    <slot />
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue';
import { useCalculatorStore } from '../stores/calculator';

const calculatorStore = useCalculatorStore();

const connected = computed({
    get() {
        return calculatorStore.connected;
    },
    set(value: boolean) {
        calculatorStore.connected = value;
    },
});

const connect = () => {
    calculatorStore.calculator.detect(connectedHandler, connectErrorHandler);
};

const connectErrorHandler = (error: any) => {
    // TODO: Handle errors.
    console.error("Connection error: " + error);
};

const connectedHandler = async () => {
    connected.value = true;
};
</script>

<style scoped></style>
