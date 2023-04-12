<template>
    <div>
        <!-- Using an iframe makes it so that all simulator-related javascript is unloaded as soon as the user leaves the page. -->
        <!-- This prevents tons of useless javascript being shipped when it's not necessary, and it's better for performance on the rest of the site. -->
        <!-- I haven't yet found an easier way to acheive this. -->
        <iframe
            id="simulator-iframe"
            :src="base_url + 'simulator/simulator.html'"
            frameborder="0"
        ></iframe>
    </div>
</template>
<script lang="ts">
import { defineComponent, PropType } from 'vue';
import { Script } from '../types';
export default defineComponent({
    name: 'Simulator',
    mounted() {
        const _this = this;
        window.onmessage = function (e) {
            if (e.data === 'Loaded') {
                _this.send();
            }
        };
    },
    data() {
        return {
            base_url: import.meta.env.BASE_URL,
        };
    },
    methods: {
        send() {
            const iframe = document.getElementById(
                'simulator-iframe'
            ) as HTMLIFrameElement;
            iframe.contentWindow?.postMessage(
                this.scripts?.map((script) => {
                    return { name: script.title, content: script.content };
                })
            );
        },
    },
    props: { scripts: Object as PropType<Script[]> },
    watch: {
        scripts: {
            deep: true,
            handler(before, after) {
                this.send();
            },
        },
    },
});
</script>

<style scoped>
iframe {
    width: 100%;
    height: 75vh;
}
</style>
