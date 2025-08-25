<template>
  <v-dialog v-model="dialog">
    <template #activator="{ props: attrs }">
      <span v-bind="attrs">
        <slot />
      </span>
    </template>
    <v-card class="card">
      <v-card-title class="headline">
        {{ $t('calculator.qrcode-popup.title') }}
      </v-card-title>

      <v-card-text v-if="progress != 100">
        <!-- TODO: Avoid <br> and improve description -->
        {{ $t('calculator.qrcode-popup.description-general') }}
        <br>
        <br>
        {{ $t('calculator.qrcode-popup.description-epsilon') }}
        <a href="https://yaya-cout.github.io/Nwagyu/guide/apps/backup.html">Nwagyu</a>
        <br>
        {{ $t('calculator.qrcode-popup.description-upsilon') }}
        <a href="https://upsilonnumworks.github.io/Upsilon-External/">Upsilon External</a>
        <br>
        <br>
        {{ $t('calculator.qrcode-popup.description-scan') }}

        <v-progress-linear
          v-model="progress"
          color="primary"
        />
        <span class="stream">
          <qrcode-stream
            :torch="torchActive"
            :track="track"
            :constraints="constraints"
            @detect="onDetect"
            @camera-on="onCameraOn"
          >
            <div
              v-if="loading"
              class="loading-indicator"
            >
              {{ $t('calculator.qrcode-popup.loading') }}
            </div>
            <v-btn
              v-if="!loading && cameraNumber > 1"
              icon
              size="x-large"
              color="secondary"
              @click="switchCamera"
            >
              <v-icon
                :alt="$t('calculator.qrcode-popup.switch-camera')"
              >
                mdi-camera-switch
              </v-icon>
            </v-btn>
            <v-btn
              v-if="!loading && !torchNotSupported"
              icon
              size="x-large"
              color="secondary"
              @click="torchActive = !torchActive"
            >
              <v-icon
                v-if="!torchActive"
                :alt="$t('calculator.qrcode-popup.toogle-torch')"
              >
                mdi-flashlight
              </v-icon>
              <v-icon
                v-else
                :alt="$t('calculator.qrcode-popup.toogle-torch')"
              >
                mdi-flashlight-off
              </v-icon>
            </v-btn>
          </qrcode-stream>
        </span>
      </v-card-text>

      <v-card-text v-else>
        {{ $t('calculator.qrcode-popup.transfer-finished') }}
      </v-card-text>


      <v-card-actions>
        <v-spacer />

        <v-btn
          @click="dialog = false"
        >
          {{ $t('calculator.qrcode-popup.close') }}
        </v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>

<script setup lang="ts">
import { ref, computed, watch } from 'vue';
import { QrcodeStream, DetectedBarcode } from 'vue-qrcode-reader'

import Storage from "upsilon.js/Storage";
const JSZip = import("jszip")

const dialog = defineModel({type: Boolean, default: false, required: true});
const loading = ref(true);
const cameraNumber = ref(1);
const constraints = ref({ facingMode: 'environment' as string } as {facingMode: string} | {deviceId: string})
const cameraId = ref(0);
const torchActive = ref(false);
const torchNotSupported = ref(false);
const transferedRawData = ref(null as ArrayBuffer | null);
const receivedDataProgression = ref(null as ArrayBuffer | null);
const bytesReceived = ref(0);

watch(dialog, () => {
  // Restore initial state when hidden
  if (!dialog.value) {
    loading.value = true;
    transferedRawData.value = null;
    receivedDataProgression.value = null;
    bytesReceived.value = 0;
  }
});

const progress = computed(() => {
  if (transferedRawData.value == null) {
    return 0;
  }
  return bytesReceived.value / transferedRawData.value.byteLength * 100;
});
const onCameraOn = async (capabilities: Partial<MediaTrackCapabilities>) => {
  loading.value = false;
  // FIXME: TS is complaining as torch shouldn't exist on
  // MediaTrackCapabilities, but this is probably a bug in vue-qrcode-reader as
  // it exists anyway and we are using the type referenced in the documentation
  torchNotSupported.value = !capabilities.torch;

  const devices = await navigator.mediaDevices.enumerateDevices()
  const videoDevices = devices.filter(({ kind }) => kind === 'videoinput')
  cameraNumber.value = videoDevices.length;
};

const track = (detectedCodes: DetectedBarcode[], ctx: CanvasRenderingContext2D) => {
  for (const detectedCode of detectedCodes) {
    const [firstPoint, ...otherPoints] = detectedCode.cornerPoints

    ctx.strokeStyle = 'red'

    ctx.beginPath()
    ctx.moveTo(firstPoint.x, firstPoint.y)
    for (const { x, y } of otherPoints) {
      ctx.lineTo(x, y)
    }
    ctx.lineTo(firstPoint.x, firstPoint.y)
    ctx.closePath()
    ctx.stroke()
  }
}

const switchCamera = async () => {
  cameraId.value++;
  const devices = await navigator.mediaDevices.enumerateDevices();
  const videoDevices = devices.filter(({ kind }) => kind === 'videoinput');


  // Wrap around if we reached maximum cameras
  if (cameraId.value >= videoDevices.length) {
    cameraId.value = 0;
  }

  constraints.value = {
    deviceId: videoDevices[cameraId.value].deviceId
  }
}

const onDetect = (detectedCodes: DetectedBarcode[]) => {
  for (let code of detectedCodes) {
    // FIXME: We shouldn't need to convert back to binary text extracted from binary
    let binary: number[] = Array.from(code.rawValue, char => char.charCodeAt(0));
    addBinaryDataToBuffer(binary);
    parseAndSaveIfTransferFinished();
  }
}

const addBinaryDataToBuffer = (buffer: number[]) => {
  // Parse metadata
  let blockID = (buffer[1] << 8) + buffer[0];
  let version = buffer[2];
  if (version != 0) {
    console.warn("Protocol version not supported:", version);
  }
  // 0 for Upsilon, 1 for Epsilon
  let firmware = buffer[3];
  let storageSize = (buffer[5] << 8) + buffer[4];
  let blockCount = (buffer[7] << 8) + buffer[6];

  // Get storage address based on block size
  const DATA_INDEX = 8;
  let dataPerBlock = buffer.length - DATA_INDEX;

  let storageIndex = blockID * dataPerBlock;

  console.log("Block ID", blockID, "Version", version, "Firmware", firmware, "Storage Size", storageSize, "Block Count", blockCount, "Storage Index", storageIndex)

  // (Re)create array if needed
  if (transferedRawData.value == null || receivedDataProgression.value == null) {
    transferedRawData.value = new ArrayBuffer(storageSize);
    receivedDataProgression.value = new ArrayBuffer(storageSize);
    bytesReceived.value = 0;
  } else if (transferedRawData.value.byteLength != storageSize) {
    console.warn("Storage size changed during transfer, resetting");
    transferedRawData.value = new ArrayBuffer(storageSize);
    receivedDataProgression.value = new ArrayBuffer(storageSize);
    bytesReceived.value = 0;
  }

  // Add data to buffer
  // TODO: Find a more efficient way to append, without iterating over the data
  let receivedDataProgressionArray = new Uint8Array(receivedDataProgression.value);
  let transferedRawDataArray = new Uint8Array(transferedRawData.value);
  for (let index = 0; index < (buffer.length - 8); index++) {
    let transferAddress = storageIndex + index;

    // Ignore out of bounds writes
    if (transferAddress > storageSize) {
      break;
    }

    // We trust the QR Code to not corrupt data during the transfer
    transferedRawDataArray[transferAddress] = buffer[index + 8];
    if (receivedDataProgressionArray[transferAddress] == 0) {
      receivedDataProgressionArray[transferAddress] = 1
      bytesReceived.value++;
    }
  }
}

const parseAndSaveIfTransferFinished = async () => {
  if (transferedRawData.value === null || bytesReceived.value != transferedRawData.value.byteLength) {
    return;
  }

  let storage = new Storage();
  let blob = new Blob([transferedRawData.value])
  await storage.parseStorage(blob);

  console.log(storage);
  await downloadAll(storage);
}


const downloadAll = async (storage: Storage) => {
  let JSZip_awaited = await JSZip;
  const zip = new JSZip_awaited.default();
  for (const record of storage.records) {
    if (record.type == "py") {
      zip.file(record.name + "." + record.type, record.code);
    } else {
      zip.file(record.name + "." + record.type, record.data);
    }
  }
  const blob = await zip.generateAsync({ type: "blob" });
  const link = document.createElement("a");
  link.href = window.URL.createObjectURL(blob);
  link.download = "backup.zip";
  link.click();
}
</script>

<style scoped>
.card {
  max-height: 100%;
}

.loading-indicator {
  font-weight: bold;
  font-size: 2rem;
  text-align: center;
}

.stream {
  /* TODO: Find a way to fix the size to avoid scrolling, and center horizontally */
  display: inline-block;
}
</style>
