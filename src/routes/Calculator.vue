<template>
  <div id="calculator-page">
    <v-card
      class="mx-auto px-6 py-8"
      width="500"
    >
      <h1 class="text-center">
        {{ $t('calculator.title') }}
      </h1>
      <WebUSBNotSupported />
      <div v-if="webUSB">
        <ConnectCalculator v-if="!connected">
          <v-btn
            v-if="!connected"
            block
            class="mt-2"
            variant="elevated"
            width="0%"
            color="primary"
            size="x-large"
          >
            {{ $t('calculator.connect') }}
          </v-btn>
        </ConnectCalculator>
        <v-btn
          v-else
          block
          class="mt-2"
          variant="elevated"
          width="0%"
          color="primary"
          size="x-large"
          @click="disconnect"
        >
          {{ $t('calculator.disconnect') }}
        </v-btn>

        <div v-if="connected">
          <CalculatorCard
            :calculator="calculator"
            :platform-info="platformInfo"
            :storage="storage"
          />

          <v-list v-if="storage.records">
            <v-checkbox
              v-model="showAll"
              :label="$t('calculator.show-all-files')"
              hide-details
            />
            <v-list-item
              v-for="(record, index) in storage.records.filter((record) => record.type === 'py' || showAll)"
              :key="index"
              class="records"
              :title="record.name + '.' + record.type"
            >
              <template #append>
                <v-btn
                  icon="mdi-content-save"
                  variant="text"
                  :loading="savingScript[index]"
                  :disabled="savingScript[index]"
                  @click="saveScript(record.name, record.type, index)"
                />
                <!-- TODO: Implement it -->
                <v-btn
                  icon="mdi-pencil"
                  variant="text"
                />
                <!-- TODO: Download -->
                <DeleteConfirm
                  :script-name="record.name + '.' + record.type"
                  @delete="deleteScript(record.name, record.type)"
                >
                  <v-btn
                    icon="mdi-delete"
                    variant="text"
                  />
                </DeleteConfirm>
              </template>
            </v-list-item>
          </v-list>
        </div>
      </div>
    </v-card>
    <v-snackbar
      v-model="deleted"
      :timeout="timeout"
    >
      <span>
        {{ $t('calculator.script-deleted') }}
      </span>
      <template #actions>
        <v-btn
          color="pink"
          variant="text"
          @click="deleted = false"
        >
          {{ $t('snackbar.close') }}
        </v-btn>
      </template>
    </v-snackbar>
    <v-snackbar
      v-model="scriptSaved"
      :timeout="timeout"
    >
      <span>
        {{ $t('calculator.script-saved', { name: scriptSavedName }) }}
      </span>
      <template #actions>
        <v-btn
          color="pink"
          variant="text"
          @click="openScript(scriptSavedId)"
        >
          {{ $t('calculator.open') }}
        </v-btn>
        <v-btn
          color="pink"
          variant="text"
          class="flex-grow-1"
          @click="scriptSaved = false"
        >
          {{ $t('snackbar.close') }}
        </v-btn>
      </template>
    </v-snackbar>
  </div>
</template>

<script lang="ts">
import { defineComponent } from 'vue';
import { useAPIStore } from '../stores/api';
import { useCalculatorStore } from "../stores/calculator";
import cloneDeep from 'lodash/cloneDeep';
import CalculatorCard from '../components/CalculatorCard.vue';
import ConnectCalculator from '../components/ConnectCalculator.vue';
import WebUSBNotSupported from '../components/WebUSBNotSupported.vue';
import DeleteConfirm from '../components/confirmations/DeleteConfirm.vue';

export default defineComponent({
  name: 'CalculatorPage',
  components: {
    CalculatorCard,
    ConnectCalculator,
    WebUSBNotSupported,
    DeleteConfirm
  },
  data() {
    return {
      webUSB: "usb" in navigator ? true : false,
      calculatorStore: useCalculatorStore(),
      calculator: useCalculatorStore().calculator,
      storage: [],
      platformInfo: {},
      api: useAPIStore().api,
      showAll: false,
      timeout: 3000,
      deleted: false as boolean,
      savingScript: [] as boolean[],
      scriptSaved: false as boolean,
      scriptSavedName: "",
      scriptSavedId: "" as string,
    }
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
      handler: async function (connected) {
        if (connected) {
          this.platformInfo = await this.calculator.getPlatformInfo();
          this.reloadScripts();
        } else {
          this.platformInfo = {};
          this.storage = [];
        }
      },
      immediate: true
    }
  },
  methods: {
    async connectedHandler() {
      this.connected = true;
    },
    connectErrorHandler(error: any) {
      // TODO: Handle errors.
      console.error("Connection error: " + error);
    },
    disconnect() {
      this.calculator.device.device_.close()
      this.disconnectHandler(false);
    },
    disconnectHandler(unexpected: boolean = true) {
      this.connected = false;
      if (unexpected) {
        this.calculator.autoConnect(this.connectedHandler);
      }
    },
    reloadScripts() {
      this.calculator.backupStorage().then((storage: any) => {
        this.storage = storage;
        this.savingScript = new Array(this.storage.records.length).fill(false);
      });
    },
    async deleteScript(name: string, type: string) {
      for (let i = 0; i < this.storage.records.length; i++) {
        if (this.storage.records[i].name == name && this.storage.records[i].type == type) {
          this.storage.records.splice(i, 1);
          break;
        }
      }

      this.calculator.installStorage(cloneDeep(this.storage), this.deletedScriptHandler);
    },
    deletedScriptHandler() {
      this.deleted = true;
      this.reloadScripts();
    },
    async saveScript(name: string, type: string, index: number) {
      this.savingScript[index] = true;

      try {
        let record = this.storage.records.find((record: any) => record.name == name && record.type == type);

        // TODO: Check if the record is valid. (assert)

        let title = record.name + "." + record.type;

        // TODO: Check if the script is already saved.

        let project_id = await this.api.createOneFileProject(title, record.code)
        // Code to use if you want to test the saving script without actually saving it to the server.
        // await new Promise(resolve => setTimeout(resolve, 1000));
        // let project_id = "11fa071a-4b2f-4d85-8c2e-20a945e26550";

        this.scriptSaved = false;
        this.scriptSavedName = title;
        this.scriptSavedId = project_id;
        this.scriptSaved = true;
      } catch (e) {
        // TODO: Handle errors.
        console.error(e);
      }
      this.savingScript[index] = false;
    },
    openScript(id: string) {
      this.$router.push({ name: 'view', params: { uuid: id } });
    },
  },
});
</script>

<style>
#calculator-page {
  display: flex;
  vertical-align: middle;
  height: 100%;
}

#calculator-page>div {
  margin: auto;
}

.script {
  width: 100%;
  display: table;
}

.script-button {
  float: right;
  vertical-align: middle;
}

.script-label {
  display: table-cell;
  vertical-align: middle;
}
</style>
