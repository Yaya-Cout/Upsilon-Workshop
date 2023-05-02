<template>
  <div>
    <v-btn
      v-if="!connected"
      @click="connect"
    >
      Select device
    </v-btn>
    <v-btn
      v-if="connected"
      @click="send"
    >
      Send scripts
    </v-btn>
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
        <v-list-item
          v-for="
            (record, index) in storage.records.filter((record)=>record.type === 'py' || showAll)"
          :key="index"
          density="compact"
          class="records"
          :title="
            //@ts-ignore
            record.name + '.' + record.type
          "
          @click="onRecordSelect(record)"
        >
          <template #append>
            <v-btn
              density="compact"
              icon="mdi-pencil"
              variant="text"
            />
            <v-btn
              density="compact"
              icon="mdi-delete"
              variant="text"
            />
          </template>
        </v-list-item>
      </v-list>
    </div>
  </div>
</template>
<script lang="ts">
import { useCalculatorStore } from '../stores/calculator';
import { defineComponent, PropType } from 'vue';
import { Script } from '../types';

export default defineComponent({
    name: 'DeviceInterface',
    props: {
        scripts: {
            type: Object as PropType<Script[]>,
            default: () => {},
        },
    },
    emits: ['record-select'],
    data() {
        return {
            showAll: false,
            storage: null,
            descriptor: '',
            calculatorStore: useCalculatorStore(),
            calculator: useCalculatorStore().calculator,
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
    methods: {
        onDisconnect() {
            this.connected = false;
        },
        disconnect() {
            this.calculator.device.device_.close();
            this.onDisconnect();
            this.calculator.stopAutoConnect();
        },
        async connect() {
            await this.calculator.detect(() => {
                this.calculator.stopAutoConnect();
                this.onConnect();
            }, this.onError);
        },
        async onConnect() {
            this.calculator.stopAutoConnect();
            this.connected = true;
            const platformInfo = await this.calculator.getPlatformInfo();

            console.log(platformInfo);
            this.descriptor = 'Connected to ';
            if (platformInfo.magik == false) {
                this.descriptor =
                    "Can't get scripts from device. Check that the calculator is in the right mode for receiving scripts.";
                return;
            }
            if (
                platformInfo.omega.installed &&
                platformInfo.omega.user.length > 0
            )
                this.descriptor += platformInfo.omega.user + "'s Numworks:\n";
            else this.descriptor += "someone's Numworks:\n";

            this.descriptor += 'E' + platformInfo.version;
            if (platformInfo.omega.installed)
                this.descriptor += ' - O' + platformInfo.omega.version;
            if (platformInfo.upsilon.installed)
                this.descriptor += ' - U' + platformInfo.upsilon.version;
            this.descriptor += ' - ' + platformInfo.commit;
            this.storage = await this.calculator.backupStorage();
        },
        //FIXME fix duplication
        async send() {
            this.storage = await this.calculator.backupStorage();
            for (const script of this.scripts) {
                //@ts-ignore
                this.storage.records.push({
                    name: script.title.substring(0, script.title.length - 3),
                    type: 'py',
                    autoImport: true,
                    code: script.content,
                });
            }
            this.calculator.installStorage(this.storage, () => {
                //TODO add visual feedback
            });
        },
        onRecordSelect(record: any) {
            this.$emit('record-select', record);
        },
        onError(err: any) {
            console.error(err);
        },
    },
});
</script>

<style scoped></style>
