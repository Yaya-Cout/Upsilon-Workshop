<template>
  <div v-if="!webUSB">
    <v-alert
      :title="$t('calculator.no-webusb')"
      :text="$t('calculator.no-webusb-text')"
      type="error"
    />
  </div>
</template>

<script lang="ts">
import { defineComponent } from 'vue';
export default defineComponent({
    data() {
        return {
            webUSB: 'usb' in navigator ? true : false,
        };
    },
});
</script>

<style scoped></style>
