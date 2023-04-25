<template>
  <div @click="connect">
    <slot />
  </div>
</template>

<script lang="ts">
import { defineComponent } from 'vue';
import { useCalculatorStore } from '@/stores/calculator';

export default defineComponent({
    data() {
        return {
            calculatorStore: useCalculatorStore(),
            calculator: useCalculatorStore().calculator,
        };
    },
    computed: {
        connected: {
            get() {
                return this.calculatorStore.connected;
            },
            set(value: boolean) {
                this.calculatorStore.connected = value;
            },
        },
    },
    methods: {
        connect() {
            this.calculator.detect(this.connectedHandler, this.connectErrorHandler);
        },
        connectErrorHandler(error: any) {
            // TODO: Handle errors.
            console.error("Connection error: " + error);
        },
        async connectedHandler() {
            this.connected = true;
        },
    },
});
</script>

<style scoped></style>
