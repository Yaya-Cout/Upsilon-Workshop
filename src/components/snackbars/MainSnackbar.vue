<!-- This component is used to import the other snackbars -->
<template>
  <ConnectCalculatorSnackbar />
  <GenericErrorSnackbar />
  <GenericSuccessSnackbar />
  <NotLoggedInSnackbar />
  <TooMuchDataErrorSnackbar />
  <UsernameTakenSnackbar />
</template>

<script setup lang="ts">
import ConnectCalculatorSnackbar from './ConnectCalculatorSnackbar.vue';
import GenericErrorSnackbar from './GenericErrorSnackbar.vue';
import GenericSuccessSnackbar from './GenericSuccessSnackbar.vue';
import NotLoggedInSnackbar from './NotLoggedInSnackbar.vue';
import TooMuchDataErrorSnackbar from './TooMuchDataErrorSnackbar.vue';
import UsernameTakenSnackbar from './UsernameTakenSnackbar.vue';
</script>

<style scoped></style>
