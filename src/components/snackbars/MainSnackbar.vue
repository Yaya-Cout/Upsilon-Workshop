<!-- This component is used to import the other snackbars -->
<template>
    <NotLoggedInSnackbar />
    <ConnectCalculatorSnackbar />
</template>

<script lang="ts">
import { defineComponent } from 'vue';
import NotLoggedInSnackbar from './NotLoggedInSnackbar.vue';
import ConnectCalculatorSnackbar from './ConnectCalculatorSnackbar.vue';

export default defineComponent({
    components: {
        NotLoggedInSnackbar,
        ConnectCalculatorSnackbar
}
});
</script>

<style scoped></style>
