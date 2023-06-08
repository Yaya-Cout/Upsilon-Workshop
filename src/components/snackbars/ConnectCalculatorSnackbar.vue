<template>
  <div class="text-center">
    <v-dialog
      v-model="dialog"
      width="auto"
    >
      <template
        v-if="calculatorStore.notConnectedError"
        #activator="{ props }"
      >
        <v-snackbar v-model="calculatorStore.notConnectedError">
          <span>
            {{ $t('snackbar.connect-calculator.calculator-not-connected') }}
          </span>
          <template #actions>
            <v-btn
              color=""
              variant="text"
              v-bind="props"
            >
              {{ $t('snackbar.connect-calculator.detect-calculator') }}
            </v-btn>
            <v-btn
              color="error"
              variant="text"
              @click="calculatorStore.notConnectedError = false"
            >
              {{ $t('snackbar.close') }}
            </v-btn>
          </template>
        </v-snackbar>
      </template>

      <v-card>
        <div v-if="webUSB">
          <v-card-text>
            <!-- TODO: Link to driver installation page -->
            {{ $t('snackbar.connect-calculator.dialog-details') }}
          </v-card-text>
          <v-card-actions>
            <v-spacer />
            <ConnectCalculator>
              <v-btn color="primary">
                {{ $t('snackbar.connect-calculator.detect-calculator') }}
              </v-btn>
            </ConnectCalculator>
            <v-btn
              color=""
              @click="dialog = false"
            >
              {{ $t('snackbar.close') }}
            </v-btn>
          </v-card-actions>
        </div>
        <div v-else>
          <WebUSBNotSupported />
          <v-card-actions>
            <v-btn
              color="primary"
              block
              @click="dialog = false"
            >
              {{ $t('snackbar.close') }}
            </v-btn>
          </v-card-actions>
        </div>
      </v-card>
    </v-dialog>
  </div>
</template>

<script lang="ts">
import { defineComponent } from 'vue';
import { useCalculatorStore } from '../../stores/calculator';
import ConnectCalculator from '../ConnectCalculator.vue';
import WebUSBNotSupported from '../WebUSBNotSupported.vue';

export default defineComponent({
    components: {
        ConnectCalculator,
        WebUSBNotSupported
    },
    data() {
        return {
            dialog: false,
            calculatorStore: useCalculatorStore(),
            calculator: useCalculatorStore().calculator,
            webUSB: 'usb' in navigator ? true : false,
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
    watch: {
        connected: {
            handler(connected: boolean) {
                if (connected) {
                    this.dialog = false;
                    this.calculatorStore.notConnectedError = false;
                }
            },
            immediate: true,
        },
    },
});
</script>

<style scoped></style>
