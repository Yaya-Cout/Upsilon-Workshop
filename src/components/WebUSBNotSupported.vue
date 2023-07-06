<template>
  <div v-if="!webUSB">
    <v-alert
      :title="$t('calculator.no-webusb')"
      :text="$t('calculator.no-webusb-text')"
      type="error"
    />
  </div>
</template>

<script setup lang="ts">
const webUSB = 'usb' in navigator ? true : false;
</script>

<style scoped></style>
