<!-- This manager manage auto-connection and disconnection of the calculator -->
<template>
  <div />
</template>

<script setup lang="ts">
import { watchEffect, onMounted } from 'vue';
import { useCalculatorStore } from '../../stores/calculator';

const calculatorStore = useCalculatorStore();

watchEffect(async () => {
    if (calculatorStore.connected) {
    let platformInfo = await calculatorStore.calculator.getPlatformInfo();
    calculatorStore.storageSize = platformInfo.storage.size;
  } else {
    calculatorStore.storageSize = -1;
  }
});

const connectedHandler = async () => {
    calculatorStore.connected = true;
    console.log("Connected");
};

onMounted(() => {
    if ("usb" in navigator) {
        calculatorStore.calculator.autoConnect(connectedHandler);
        navigator.usb.addEventListener("disconnect", function (e: any) {
            calculatorStore.calculator.onUnexpectedDisconnect(e, function () {
                calculatorStore.connected = false;
                calculatorStore.calculator.autoConnect(connectedHandler);
            });
        });
    }
});
</script>

<style scoped></style>
