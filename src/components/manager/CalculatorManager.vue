<!-- This manager manage auto-connection and disconnection of the calculator -->
<template>
  <div />
</template>

<script lang="ts">
import { defineComponent } from 'vue';
import { useCalculatorStore } from '../../stores/calculator';

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
    mounted() {
        if ("usb" in navigator) {
            this.calculator.autoConnect(this.connectedHandler);
            const _this = this;
            navigator.usb.addEventListener("disconnect", function (e: any) {
                _this.calculator.onUnexpectedDisconnect(e, function () {
                    _this.connected = false;
                    _this.calculator.autoConnect(_this.connectedHandler);
                });
            });
        }
    },
    methods: {
        connectedHandler() {
            this.connected = true;
        },
    },
});
</script>

<style scoped></style>
