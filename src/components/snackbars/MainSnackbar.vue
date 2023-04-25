<!-- This component is used to import the other snackbars -->
<template>
  <ConnectCalculatorSnackbar />
  <GenericErrorSnackbar />
  <InstallationSuccessSnackbar />
  <NotLoggedInSnackbar />
  <TooMuchDataErrorSnackbar />
</template>

<script lang="ts">
import { defineComponent } from 'vue';
import NotLoggedInSnackbar from './NotLoggedInSnackbar.vue';
import ConnectCalculatorSnackbar from './ConnectCalculatorSnackbar.vue';
import InstallationSuccessSnackbar from './InstallationSuccessSnackbar.vue';
import TooMuchDataErrorSnackbar from './TooMuchDataErrorSnackbar.vue';
import GenericErrorSnackbar from './GenericErrorSnackbar.vue';

export default defineComponent({
    components: {
        NotLoggedInSnackbar,
        ConnectCalculatorSnackbar,
        InstallationSuccessSnackbar,
        TooMuchDataErrorSnackbar,
        GenericErrorSnackbar
    }
});
</script>

<style scoped></style>
