<template>
  <div>
    <!-- Using an iframe makes it so that all simulator-related javascript is unloaded as soon as the user leaves the page. -->
    <!-- This prevents tons of useless javascript being shipped when it's not necessary, and it's better for performance on the rest of the site. -->
    <!-- I haven't yet found an easier way to achieve this. -->
    <iframe
      id="simulator-iframe"
      :src="base_url + 'simulator/CASWorksSimulator.html'"
      frameborder="0"
    />
  </div>
</template>

<script setup lang="ts">
import { ref, watch, onMounted } from 'vue';
import { Script } from '../../types';

const base_url = import.meta.env.BASE_URL;

const last_scripts_empty = ref(true);

const props = defineProps({
    scripts: {
        type: Array as () => Script[],
        required: true
    }
});

watch(props.scripts, () => {
    if (props.scripts.length === 0) {
        last_scripts_empty.value = true;
        return;
    } else if (last_scripts_empty.value) {
        last_scripts_empty.value = false;
        send();
    }
    // If a project is already loaded, we don't update the simulator
    // because it would cause the simulator to reload and lose its state.
    // You should call send() from the parent component to force an update.
}, { deep: true });

onMounted(() => {
    window.onmessage = function (e) {
        if (e.data === 'Loaded') {
            _send();
        }
    };
});

const send = () => {
    const iframe = document.getElementById(
        'simulator-iframe'
    ) as HTMLIFrameElement;
    // Reload the iframe to make sure it's in a clean state.
    iframe.contentDocument?.location.reload();
}

const _send = () => {
    const iframe = document.getElementById(
        'simulator-iframe'
    ) as HTMLIFrameElement;
    iframe.contentWindow?.postMessage(
        props.scripts.map((script) => {
            return { name: script.title, content: script.content.normalize('NFKD') };
        })
    );
}

defineExpose({
    send
});
</script>

<style scoped>
iframe {
    width: 100%;
    height: 75vh;
}
</style>
