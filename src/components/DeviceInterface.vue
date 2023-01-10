<template>
    <div>
        <v-btn @click="connect"> Select device </v-btn>
        <v-btn @click="send">Send scripts</v-btn>
        <div id="info">
            {{ descriptor }}
        </div>
        <v-checkbox v-model="showAll" label="Show non-python files" />
        <div id="files"></div>
        <div
            class="records"
            v-for="
        //@ts-ignore
        record in storage.records"
            v-if="storage"
        >
            {{
                //@ts-ignore
                record.name + '.' + record.type
            }}
        </div>
    </div>
</template>
<script lang="ts">
import { connect } from 'http2';
import { send } from 'process';
import Numworks from 'upsilon.js';
import { defineComponent, PropType } from 'vue';
import { Script } from '../types';

export default defineComponent({
    name: 'DeviceInterface',
    props: {
        scripts: { type: Object as PropType<Script[]>, default: [] },
    },
    data() {
        return {
            showAll: false,
            storage: null,
            calculator: new Numworks(),
            descriptor: '',
        };
    },
    methods: {
        async connect() {
            await this.calculator.detect(() => {
                this.calculator.stopAutoConnect();
                this.onConnect();
            }, this.onError);
        },
        async onConnect() {
            const platformInfo = await this.calculator.getPlatformInfo();
            this.descriptor = 'Connected to ';
            if (platformInfo.omega && platformInfo.omega.user.length > 0)
                this.descriptor += platformInfo.omega.user + "'s Numworks:\n";
            else this.descriptor += "someone's Numworks:\n";

            this.descriptor += 'E' + platformInfo.version;
            if (platformInfo.omega)
                this.descriptor += ' - O' + platformInfo.omega.version;
            if (platformInfo.upsilon)
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
            this.calculator.installStorage(this.storage);
        },
        onError(err: any) {
            console.error(err);
        },
    },
});
</script>

<style scoped></style>
