<!-- This component is used to import the other snackbars -->
<template>
  <AccountCreatedSnackbar />
  <ConnectCalculatorSnackbar />
  <GenericErrorSnackbar />
  <InstallationSuccessSnackbar />
  <NotLoggedInSnackbar />
  <TooMuchDataErrorSnackbar />
  <UsernameTakenSnackbar />
</template>

<script lang="ts">
import { defineComponent } from 'vue';
import NotLoggedInSnackbar from './NotLoggedInSnackbar.vue';
import ConnectCalculatorSnackbar from './ConnectCalculatorSnackbar.vue';
import InstallationSuccessSnackbar from './InstallationSuccessSnackbar.vue';
import TooMuchDataErrorSnackbar from './TooMuchDataErrorSnackbar.vue';
import GenericErrorSnackbar from './GenericErrorSnackbar.vue';
import AccountCreatedSnackbar from './AccountCreatedSnackbar.vue';
import UsernameTakenSnackbar from './UsernameTakenSnackbar.vue';

export default defineComponent({
  components: {
    NotLoggedInSnackbar,
    ConnectCalculatorSnackbar,
    InstallationSuccessSnackbar,
    TooMuchDataErrorSnackbar,
    GenericErrorSnackbar,
    AccountCreatedSnackbar,
    UsernameTakenSnackbar
  }
});
</script>

<style scoped></style>
