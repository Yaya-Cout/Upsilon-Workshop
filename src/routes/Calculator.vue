<template>
    <div id="calculator-page">
        <v-card class="mx-auto px-6 py-8" width="500">
            <h1 class="text-center">{{ $t('calculator.title') }}</h1>

            <div v-if="!webUSB">
                <v-alert :title="$t('calculator.no-webusb')" :text="$t('calculator.no-webusb-text')" type="error"></v-alert>
            </div>
            <div v-else>
                <v-btn @click="connect" block class="mt-2" variant="elevated" width="0%" color="primary" size="x-large"
                    v-if="!connected">
                    {{ $t('calculator.connect') }}
                </v-btn>
                <v-btn @click="disconnect" block class="mt-2" variant="elevated" width="0%" color="primary" size="x-large"
                    v-else>
                    {{ $t('calculator.disconnect') }}
                </v-btn>

                <div v-if="connected">
                    <CalculatorCard :calculator="calculator" :platformInfo="platformInfo" :storage="storage" />

                    <v-list v-if="storage.records">
                        <v-checkbox v-model="showAll" label="Show all files" hide-details />
                        <v-list-item class="records" v-for="
                                    //@ts-ignore
                                            record in storage.records.filter((record) => record.type === 'py' || showAll)"
                            :title="
                                //@ts-ignore
                                record.name + '.' + record.type
                            ">
                            <template v-slot:append>
                                <v-btn icon="mdi-content-save" variant="text"
                                    @click="saveScript(record.name, record.type)"
                                    :loading="savingScript" :disabled="savingScript">
                                </v-btn>
                                <v-btn icon="mdi-pencil" variant="text"></v-btn>
                                <v-btn icon="mdi-delete" variant="text"
                                    @click="deleteScript(record.name, record.type)"></v-btn>
                            </template>
                        </v-list-item>
                    </v-list>
                </div>
            </div>
        </v-card>
        <v-snackbar v-model="deleted" :timeout="timeout">
            <span>
                {{ $t('calculator.script-deleted') }}
            </span>
            <template v-slot:actions>
                <v-btn color="pink" variant="text" @click="deleted = false">
                    {{ $t('snackbar.close') }}
                </v-btn>
            </template>
        </v-snackbar>
        <v-snackbar v-model="scriptSaved" :timeout="timeout">
            <span>
                {{ $t('calculator.script-saved', { name: scriptSavedName }) }}
            </span>
            <template v-slot:actions>
                <v-btn color="pink" variant="text" @click="openScript(scriptSavedId)">
                    {{ $t('calculator.open') }}
                </v-btn>
                <v-btn color="pink" variant="text" @click="scriptSaved = false">
                    {{ $t('snackbar.close') }}
                </v-btn>
            </template>
        </v-snackbar>
    </div>
</template>

<script lang="ts">
import { defineComponent } from 'vue';
import { useAPIStore } from '../stores/api';
import NumWorks from "upsilon.js";
import cloneDeep from 'lodash/cloneDeep';
import CalculatorCard from '../components/CalculatorCard.vue';

export default defineComponent({
    name: 'LoginPage',
    components: {
        CalculatorCard,
    },
    data() {
        return {
            calculator: new NumWorks(),
            webUSB: "usb" in navigator ? true : false,
            connected: false,
            storage: [],
            platformInfo: {},
            api: useAPIStore().api,
            showAll: false,
            timeout: 3000,
            deleted: false as boolean,
            savingScript: false as boolean,
            scriptSaved: false as boolean,
            scriptSavedName: "",
            scriptSavedId: "" as string,
        }
    },
    mounted() {
        if (this.webUSB) {
            this.calculator.autoConnect(this.connectedHandler);
            const _this = this;
            navigator.usb.addEventListener("disconnect", function (e: any) {
                _this.calculator.onUnexpectedDisconnect(e, _this.disconnectHandler);
            });
        }
    },
    methods: {
        connect() {
            this.calculator.detect(this.connectedHandler, this.connectErrorHandler);
        },
        async connectedHandler() {
            this.connected = true;
            this.platformInfo = await this.calculator.getPlatformInfo();
            this.reloadScripts();
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
            });
        },
        async deleteScript(name: string, type: string) {
            // Delete the script from the list.
            for (let i = 0; i < this.storage.records.length; i++) {
                if (this.storage.records[i].name == name && this.storage.records[i].type == type) {
                    this.storage.records.splice(i, 1);
                    break;
                }
            }

            // Install the new list to the calculator.
            this.calculator.installStorage(cloneDeep(this.storage), this.deletedScriptHandler);
        },
        deletedScriptHandler() {
            this.deleted = true;
            this.reloadScripts();
        },
        installStorageHandler() {
            this.reloadScripts();
        },
        async saveScript(name: string, type: string) {
            // Set the savingScript to true to disable the button.
            this.savingScript = true;

            // We use a try catch to make sure the savingScript is set to false.
            try {
                // Get the full record.
                let record = this.storage.records.find((record: any) => record.name == name && record.type == type);

                // TODO: Check if the record is valid. (assert)

                let title = record.name + "." + record.type;

                // TODO: Check if the script is already saved.

                // Save the script.
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
            this.savingScript = false;
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
    /* display: table-cell; */
}

.script-label {
    display: table-cell;
    vertical-align: middle;
    /* vertical-align: middle; */
}
</style>
