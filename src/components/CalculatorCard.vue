<template>
  <v-card class="mx-auto calculator-card">
    <v-card-item :title="$t('calculator.numworks-of') + ' ' + username" />

    <v-card-text class="py-0">
      <v-row
        align="center"
        no-gutters
      >
        <v-col
          class="text-h2"
          cols="6"
        >
          {{ storagePercentage }} %
        </v-col>

        <v-col
          cols="6"
          class="text-right"
        >
          <img
            :src="firmwareLogo"
            :alt="firmware"
            width="88"
            class="os-icon"
          >
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
      <v-list-item
        density="compact"
        prepend-icon="mdi-source-branch"
      >
        <v-list-item-subtitle>{{ version }}</v-list-item-subtitle>
      </v-list-item>
    </div>
  </v-card>
</template>

<script setup lang="ts">
import { computed } from 'vue';
import { useI18n } from 'vue-i18n';
const { t: $t } = useI18n();

const props = defineProps({
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
});

const username = computed(() => {
  if (props.platformInfo && props.platformInfo["omega"] && props.platformInfo["omega"]["user"]) {
    return props.platformInfo["omega"]["user"];
  } else {
    return $t('calculator.unknown');
  }
});

const totalSize = computed(() => {
  if (!props.platformInfo || !props.platformInfo["storage"] || !props.platformInfo["storage"]["size"]) {
    return 0;
  } else {
    return props.platformInfo["storage"]["size"];
  }
});

const usedSize = computed(() => {
  let usedSize = 0;
  if (props.storage && props.storage.records) {
    for (let i = 0; i < props.storage.records.length; i++) {
      if ("data" in props.storage.records[i]) {
        usedSize += props.storage.records[i].data.size;
      } else if ("code" in props.storage.records[i]) {
        usedSize += props.storage.records[i].code.length;
      } else {
        console.warn("Unknown record type: ", props.storage.records[i]);
      }
    }
  }
  return usedSize;
});

const storagePercentage = computed(() => {
  return Math.round(usedSize.value / totalSize.value * 100);
});

const version = computed(() => {
  if (props.platformInfo && props.platformInfo["upsilon"] && props.platformInfo["upsilon"]["version"]) {
    return props.platformInfo["upsilon"]["version"];
  } else if (props.platformInfo && props.platformInfo["omega"] && props.platformInfo["omega"]["version"]) {
    return props.platformInfo["omega"]["version"];
  } else {
    return props.platformInfo["version"];
  }
});

const firmware = computed(() => {
  // Return the installed firmware based on the platform info
  if (props.platformInfo) {
    if (props.platformInfo["upsilon"]) {
      if (!props.platformInfo["upsilon"]["installed"]) {
        console.warn("Upsilon is not installed but is present in platform info");
      }
      return "upsilon";
    } else if (props.platformInfo["omega"]) {
      if (!props.platformInfo["omega"]["installed"]) {
        console.warn("Omega is not installed but is present in platform info");
      }
      return "omega";
    } else {
      return "epsilon";
    }
  } else {
    return "epsilon";
  }
});

const firmwareLogo = computed(() => {
  // Return the logo of the installed firmware
  // We can't use @/assets/* because the path is not resolved correctly
  // when the app is built, so we load the images from the public folder
  if (firmware.value == "upsilon") {
    return import.meta.env.BASE_URL + "assets/upsilon.svg";
  } else if (firmware.value == "omega") {
    // Omega logo is not available in SVG format yet (so we use PNG under MIT license)
    return import.meta.env.BASE_URL + "assets/omega.png";
  } else {
    return import.meta.env.BASE_URL + "assets/epsilon.svg";
  }
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
