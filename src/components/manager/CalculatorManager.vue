<!-- This manager manage auto-connection and disconnection of the calculator -->
<template>
  <div />
</template>

<script setup lang="ts">
import { computed, onMounted } from 'vue';
import { useCalculatorStore } from '../../stores/calculator';

const calculatorStore = useCalculatorStore();

const connected = computed({
    get() {
        return calculatorStore.connected;
    },
    set(value: boolean) {
        calculatorStore.connected = value;
    },
});

const connectedHandler = async () => {
    connected.value = true;
    console.log("Connected");
};

onMounted(() => {
    if ("usb" in navigator) {
        calculatorStore.calculator.autoConnect(connectedHandler);
        navigator.usb.addEventListener("disconnect", function (e: any) {
            calculatorStore.calculator.onUnexpectedDisconnect(e, function () {
                connected.value = false;
                calculatorStore.calculator.autoConnect(connectedHandler);
            });
        });
    }
});
</script>

<style scoped></style>
