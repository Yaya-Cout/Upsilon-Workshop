<template>
    <div id="monaco-editor"></div>
</template>
<script lang="ts">
import * as monaco from 'monaco-editor';
import { defineComponent } from 'vue';
export default defineComponent({
    name: 'MonacoEditor',
    mounted() {
        const editor = document.getElementById('monaco-editor')
        console.log(editor)
        if (editor === null) return
        monaco.editor.create(editor, {
            value: `from math import *
from kandinsky import *
from random import *
from ion import *
from time import *

try:
  from os import *
except:
  draw_string("only works on omega/upsilon", 0, 0, (255, 0, 0), (0, 0, 0))
  sleep(2)

# Config
boatcount = [2, 3, 3, 2]

# Colors
fg = (0, 0, 0)
bg = (255, 255, 255)

# Comment out the following two lines if you don't have upsilon installed
fg = get_palette()["PrimaryText"]  # (0, 0, 0)
bg = get_palette()["HomeBackground"]  # (255, 255, 255)
`,
            language: 'python',
            automaticLayout: true
        });
    }
});
</script>

<style scoped>
#monaco-editor {
    height: 100%;
}
</style>