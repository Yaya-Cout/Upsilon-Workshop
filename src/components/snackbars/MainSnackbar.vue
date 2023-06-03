<!-- This component is used to import the other snackbars -->
<template>
  <AccountCreatedSnackbar />
  <ConnectCalculatorSnackbar />
  <GenericErrorSnackbar />
  <InstallationSuccessSnackbar />
  <NotLoggedInSnackbar />
  <ProjectCreatedSnackbar />
  <ProjectDeletedSnackbar />
  <ScriptSavedSnackbar />
  <TooMuchDataErrorSnackbar />
  <UsernameTakenSnackbar />
</template>

<script lang="ts">
import { defineComponent } from 'vue';
import AccountCreatedSnackbar from './AccountCreatedSnackbar.vue';
import ConnectCalculatorSnackbar from './ConnectCalculatorSnackbar.vue';
import GenericErrorSnackbar from './GenericErrorSnackbar.vue';
import InstallationSuccessSnackbar from './InstallationSuccessSnackbar.vue';
import NotLoggedInSnackbar from './NotLoggedInSnackbar.vue';
import ProjectCreatedSnackbar from './ProjectCreatedSnackbar.vue';
import ProjectDeletedSnackbar from './ProjectDeletedSnackbar.vue';
import ScriptSavedSnackbar from './ScriptSavedSnackbar.vue';
import TooMuchDataErrorSnackbar from './TooMuchDataErrorSnackbar.vue';
import UsernameTakenSnackbar from './UsernameTakenSnackbar.vue';

export default defineComponent({
  components: {
    AccountCreatedSnackbar,
    ConnectCalculatorSnackbar,
    GenericErrorSnackbar,
    InstallationSuccessSnackbar,
    NotLoggedInSnackbar,
    ProjectCreatedSnackbar,
    ProjectDeletedSnackbar,
    ScriptSavedSnackbar,
    TooMuchDataErrorSnackbar,
    UsernameTakenSnackbar
  }
});
</script>

<style scoped></style>
