<template>
  <div>
    <!-- Using an iframe makes it so that all simulator-related javascript is unloaded as soon as the user leaves the page. -->
    <!-- This prevents tons of useless javascript being shipped when it's not necessary, and it's better for performance on the rest of the site. -->
    <!-- I haven't yet found an easier way to achieve this. -->
    <iframe
      id="simulator-iframe"
      :src="base_url + 'simulator/simulator.html'"
      frameborder="0"
    />
  </div>
</template>
<script lang="ts">
import { defineComponent, PropType } from 'vue';
import { Script } from '../types';
export default defineComponent({
    name: 'SimulatorView',
    props: {
        scripts: {
            type: Object as PropType<Script[]>,
            required: true
        },
    },
    data() {
        return {
            base_url: import.meta.env.BASE_URL,
            last_scripts_empty: true
        };
    },
    watch: {
        scripts: {
            deep: true,
            handler() {
                if (this.scripts.length === 0) {
                    this.last_scripts_empty = true;
                    return;
                } else if (this.last_scripts_empty) {
                    this.last_scripts_empty = false;
                    this.send();
                }
                // If a project is already loaded, we don't update the simulator
                // because it would cause the simulator to reload and lose its state.
                // You should call send() from the parent component to force an update.
            },
        },
    },
    mounted() {
        const _this = this;
        window.onmessage = function (e) {
            if (e.data === 'Loaded') {
                _this._send();
            }
        };
    },
    methods: {
        send() {
            const iframe = document.getElementById(
                'simulator-iframe'
            ) as HTMLIFrameElement;
            // Reload the iframe to make sure it's in a clean state.
            iframe.src = iframe.src;
        },
        _send() {
            const iframe = document.getElementById(
                'simulator-iframe'
            ) as HTMLIFrameElement;
            iframe.contentWindow?.postMessage(
                this.scripts.map((script) => {
                    return { name: script.title, content: script.content };
                })
            );
        },
    },
    expose: ['send'],
});

</script>

<style scoped>
iframe {
    width: 100%;
    height: 75vh;
}
</style>
