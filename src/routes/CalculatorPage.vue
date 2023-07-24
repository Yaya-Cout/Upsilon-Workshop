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
                <!-- If fullName is null, then the record is invalid. -->
                <RenameScript
                  v-if="record.fullName"
                  v-model="record.fullName"
                >
                  <v-btn
                    icon="mdi-pencil"
                    variant="text"
                  />
                </RenameScript>
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

<script setup lang="ts">
import { ref, computed, watch, watchEffect } from 'vue';
import { useRouter } from 'vue-router';
import cloneDeep from 'lodash/cloneDeep';
import { Storage } from '../types';
import { useAPIStore } from '../stores/api';
import { useCalculatorStore } from "../stores/calculator";
import { useGlobalStore } from '../stores/global';
import CalculatorCard from '../components/CalculatorCard.vue';
import ConnectCalculator from '../components/ConnectCalculator.vue';
import WebUSBNotSupported from '../components/WebUSBNotSupported.vue';
import DeleteConfirm from '../components/confirmations/DeleteConfirm.vue';
import RenameScript from '../components/RenameScript.vue';

const calculatorStore = useCalculatorStore();
const calculator = calculatorStore.calculator;
const apiStore = useAPIStore();
const globalStore = useGlobalStore();
const api = apiStore.api;
const webUSB = "usb" in navigator ? true : false;
const $router = useRouter();

const storage = ref({magik: false, records: []} as Storage);
const platformInfo = ref({});
const showAll = ref(false);
const timeout = ref(3000);
const deleted = ref(false);
const savingScript = ref([] as boolean[]);
const scriptSaved = ref(false);
const scriptSavedName = ref("");
const scriptSavedId = ref("");

const connected = computed({
  get() {
    return calculatorStore.connected;
  },
  set(value: boolean) {
    calculatorStore.connected = value;
  },
})

const connectedHandler = () => {
  connected.value = true;
};

const disconnect = () => {
  calculator.device.device_.close()
  disconnectHandler(false);
};

const disconnectHandler = (unexpected: boolean = true) => {
  connected.value = false;
  if (unexpected) {
    calculator.autoConnect(connectedHandler);
  }
};

watchEffect(() => {
  let install = false;
  for (let i = 0; i < storage.value.records.length; i++) {
    let record = storage.value.records[i];
    let fullName = record.fullName;
    if (!fullName) {
      throw new Error("Record doesn't have a fullName");
    }
    let name = fullName.split(".")[0];
    let type = fullName.split(".")[1];
    if (record.name != name || record.type != type) {
      record.name = name;
      record.type = type;
      install = true;
    }
  }

  if (install) {
    calculator.installStorage(cloneDeep(storage.value), () => {});
  }
});

const reloadScripts = () => {
  calculator.backupStorage().then((NewStorage: any) => {
    console.log(NewStorage)
    for (let i = 0; i < NewStorage.records.length; i++) {
      if (!NewStorage.records[i].fullName) {
        NewStorage.records[i].fullName = NewStorage.records[i].name + "." + NewStorage.records[i].type;
      }
    }

    storage.value = NewStorage;
    savingScript.value = new Array(storage.value.records.length).fill(false);
  });
};

const deleteScript = (name: string, type: string) => {
  for (let i = 0; i < storage.value.records.length; i++) {
    if (storage.value.records[i].name == name && storage.value.records[i].type == type) {
      storage.value.records.splice(i, 1);
      break;
    }
  }

  calculator.installStorage(cloneDeep(storage.value), deletedScriptHandler);
};

const deletedScriptHandler = () => {
  deleted.value = true;
  reloadScripts();
};

const saveScript = async (name: string, type: string, index: number) => {
  savingScript.value[index] = true;

  try {
    let record = storage.value.records.find((record: any) => record.name == name && record.type == type);
    if (!record) {
      throw new Error("Record not found");
    }

    let title = record.name + "." + record.type;

    // TODO: Check if the script is already saved.

    let project_id = await api.createOneFileProject(title, record.code)
    // Code to use if you want to test the saving script without actually saving it to the server.
    // await new Promise(resolve => setTimeout(resolve, 1000));
    // let project_id = "11fa071a-4b2f-4d85-8c2e-20a945e26550";

    scriptSaved.value = false;
    scriptSavedName.value = title;
    scriptSavedId.value = project_id;
    scriptSaved.value = true;
  } catch (e) {
    console.error(e);
    globalStore.error = true;
  }
  savingScript.value[index] = false;
};

const openScript = (id: string) => {
  $router.push({ name: 'view', params: { uuid: id } });
};

watch(connected, async (connected) => {
  if (connected) {
    platformInfo.value = await calculator.getPlatformInfo();
    reloadScripts();
  } else {
    platformInfo.value = {};
    storage.value = {magik: false, records: []};
  }
}, { immediate: true });
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
