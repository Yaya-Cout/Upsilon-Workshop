<!-- This component is used to import the other snackbars -->
<template>
    <NotLoggedInSnackbar />
    <ConnectCalculatorSnackbar />
    <InstallationSuccessSnackbar />
    <TooMuchDataErrorSnackbar />
</template>

<script lang="ts">
import { defineComponent } from 'vue';
import NotLoggedInSnackbar from './NotLoggedInSnackbar.vue';
import ConnectCalculatorSnackbar from './ConnectCalculatorSnackbar.vue';
import InstallationSuccessSnackbar from './InstallationSuccessSnackbar.vue';
import TooMuchDataErrorSnackbar from './TooMuchDataErrorSnackbar.vue';

export default defineComponent({
    components: {
        NotLoggedInSnackbar,
        ConnectCalculatorSnackbar,
        InstallationSuccessSnackbar,
        TooMuchDataErrorSnackbar
    }
});
</script>

<style scoped></style>
