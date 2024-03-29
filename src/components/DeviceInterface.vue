<template>
  <div>
    <v-btn
      v-if="!connected"
      @click="connect"
    >
      Select device
    </v-btn>
    <UploadProject
      v-if="connected"
      :files="scripts"
      class="mr-2"
    >
      <v-btn>
        Send scripts
      </v-btn>
    </UploadProject>
    <v-btn
      v-if="connected"
      @click="disconnect"
    >
      Disconnect
    </v-btn>
    <div id="info">
      {{ connected ? descriptor : 'Not connected' }}
    </div>
    <div
      v-if="connected && storage"
      id="files"
    >
      <v-checkbox
        v-model="showAll"
        label="Show non-python files"
        hide-details
      />
      <v-list>
        <ReplaceConfirm
          v-for="
            (record, index) in storage.records.filter((record)=>record.type === 'py' || showAll)"
          :key="index"
          :script-name="record.name + '.' + record.type"
          :scripts="scripts"
          @replace="onRecordSelect(record)"
        >
          <v-list-item
            :key="index"
            density="compact"
            class="records"
            :title="
              //@ts-ignore
              record.name + '.' + record.type
            "
            @click="function() {}"
          >
            <template #append>
              <v-btn
                density="compact"
                icon="mdi-delete"
                variant="text"
                @click="deleteRecord(record)"
              />
            </template>
          </v-list-item>
        </ReplaceConfirm>
      </v-list>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, watch } from 'vue';
import { useCalculatorStore } from '../stores/calculator';
import { useGlobalStore } from '../stores/global';
import { Script } from '../types';
import ReplaceConfirm from './confirmations/ReplaceConfirm.vue';
import UploadProject from './UploadProject.vue';

const calculatorStore = useCalculatorStore();
const calculator = calculatorStore.calculator;
const globalStore = useGlobalStore();

const showAll = ref(false);
const storage = ref(null);
const descriptor = ref('');

const emits = defineEmits(['record-select']);

defineProps({
    scripts: {
        type: Object as () => Script[],
        default: () => {},
    },
});

const connected = computed({
    get() {
        return calculatorStore.connected;
    },
    set(value: boolean) {
        calculatorStore.connected = value;
    },
});

function onDisconnect() {
    connected.value = false;
}

function disconnect() {
    calculator.device.device_.close();
    onDisconnect();
    calculator.stopAutoConnect();
}

async function connect() {
    await calculator.detect(() => {
        calculator.stopAutoConnect();
        onConnect();
    }, onError);
}

async function onConnect() {
    calculator.stopAutoConnect();
    connected.value = true;
    const platformInfo = await calculator.getPlatformInfo();

    descriptor.value = 'Connected to ';
    if (platformInfo.magik == false) {
        descriptor.value =
            "Can't get scripts from device. Check that the calculator is in the right mode for receiving scripts.";
        return;
    }
    if (
        platformInfo.omega.installed &&
        platformInfo.omega.user.length > 0
    )
        descriptor.value += platformInfo.omega.user + "'s Numworks:\n";
    else descriptor.value += "someone's Numworks:\n";

    descriptor.value += 'E' + platformInfo.version;
    if (platformInfo.omega.installed)
        descriptor.value += ' - O' + platformInfo.omega.version;
    if (platformInfo.upsilon.installed)
        descriptor.value += ' - U' + platformInfo.upsilon.version;
    descriptor.value += ' - ' + platformInfo.commit;
    storage.value = await calculator.backupStorage();
}

function onRecordSelect(record: any) {
  emits('record-select', record);
}

function deleteRecord(record: any) {
    const index = storage.value.records.findIndex(
        (r: any) => r.name === record.name
    );
    if (index !== -1) {
        storage.value.records.splice(index, 1);
    }
    calculator.installStorage(storage.value, () => {
      globalStore.success = "snackbar.success.script-deleted.message"
    });
}

function onError(err: any) {
    console.error(err);
}

watch(connected, () => {
    if (connected.value) {
        onConnect();
    } else {
        onDisconnect();
    }
}, { immediate: true });
</script>

<style scoped></style>
