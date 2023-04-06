<template>
    <v-card class="mx-auto calculator-card">
        <v-card-item :title="$t('calculator.numworks-of') + ' ' + username">
        </v-card-item>

        <v-card-text class="py-0">
            <v-row align="center" no-gutters>
                <v-col class="text-h2" cols="6">
                    {{ storagePercentage }} %
                </v-col>

                <v-col cols="6" class="text-right">
                    <img :src="firmwareLogo" :alt="firmware" width="88" class="os-icon" />
                </v-col>

                <v-col cols="12">
                    <v-progress-linear
                        :model-value="storagePercentage"
                        :color="storagePercentage > 90 ? 'red' : 'primary'"
                        height="8"
                        class="my-2"
                        rounded
                    />
                </v-col>
            </v-row>
        </v-card-text>

        <div class="d-flex py-3 justify-space-between">
            <v-list-item density="compact" prepend-icon="mdi-source-branch">
                <v-list-item-subtitle>{{ version }}</v-list-item-subtitle>
            </v-list-item>
        </div>
    </v-card>
</template>

<script lang="ts">
import { cp } from 'fs';
import { defineComponent } from 'vue';
export default defineComponent({
    props: {
        calculator: {
            type: Object,
            required: true,
        },
        platformInfo: {
            type: Object,
            required: true,
        },
        storage: {
            type: Object,
            required: true,
        },
    },
    data() {
        return {
            expand: false,
        };
    },

    computed: {
        username() {
            if (this.$props.platformInfo && this.$props.platformInfo["omega"] && this.$props.platformInfo["omega"]["user"]) {
                return this.$props.platformInfo["omega"]["user"];
            } else {
                return this.$t('calculator.unknown');
            }
        },
        totalSize() {
            if (!this.$props.platformInfo || !this.$props.platformInfo["storage"] || !this.$props.platformInfo["storage"]["size"]) {
                return 0;
            } else {
                return this.$props.platformInfo["storage"]["size"];
            }
        },
        usedSize() {
            let usedSize = 0;
            if (this.$props.storage && this.$props.storage.records) {
                for (let i = 0; i < this.$props.storage.records.length; i++) {
                    if (this.$props.storage.records[i].data) {
                    } else if (this.$props.storage.records[i].code) {
                        usedSize += this.$props.storage.records[i].code.length;
                    } else {
                        console.warn("Unknown record type: ", this.$props.storage.records[i]);
                    }
                }
            }
            return usedSize;
        },
        storagePercentage() {
            return Math.round(this.usedSize / this.totalSize * 100);
        },
        version() {
            if (this.$props.platformInfo && this.$props.platformInfo["upsilon"] && this.$props.platformInfo["upsilon"]["version"]) {
                return this.$props.platformInfo["upsilon"]["version"];
            } else if (this.$props.platformInfo && this.$props.platformInfo["omega"] && this.$props.platformInfo["omega"]["version"]) {
                return this.$props.platformInfo["omega"]["version"];
            } else {
                return this.$props.platformInfo["version"];
            }
        },
        firmware() {
            // Return the installed firmware based on the platform info
            if (this.$props.platformInfo) {
                if (this.$props.platformInfo["upsilon"]) {
                    if (!this.$props.platformInfo["upsilon"]["installed"]) {
                        console.warn("Upsilon is not installed but is present in platform info");
                    }
                    return "upsilon";
                } else if (this.$props.platformInfo["omega"]) {
                    if (!this.$props.platformInfo["omega"]["installed"]) {
                        console.warn("Omega is not installed but is present in platform info");
                    }
                    return "omega";
                } else {
                    return "epsilon";
                }
            } else {
                return "epsilon";
            }
        },
        firmwareLogo() {
            // Return the logo of the installed firmware
            // We can't use @/assets/* because the path is not resolved correctly
            // when the app is built, so we load the images from the public folder
            if (this.firmware == "upsilon") {
                return "/assets/upsilon.svg";
            } else if (this.firmware == "omega") {
                // Omega logo is not available in SVG format yet (so we use PNG under MIT license)
                return "/assets/omega.png";
            } else {
                return "/assets/epsilon.svg";
            }
        },
    },
});
</script>

<style scoped>
.os-icon {
    border-radius: 50%;
}

.calculator-card {
    margin-top: 1rem;
    margin-bottom: 1rem;
}
</style>
