<!--
  Upsilon Workshop
  Copyright (C) 2022 Upsilon Workshop

  This program is free software: you can redistribute it and/or modify
  it under the terms of the GNU Affero General Public License as published by
  the Free Software Foundation, either version 3 of the License, or
  (at your option) any later version.

  This program is distributed in the hope that it will be useful,
  but WITHOUT ANY WARRANTY; without even the implied warranty of
  MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
  GNU Affero General Public License for more details.

  You should have received a copy of the GNU Affero General Public License
  along with this program.  If not, see <https://www.gnu.org/licenses/>.

  SPDX-License-Identifier: AGPL-3.0-or-later
 -->
<template>
  <div id="app">
    <v-col
      v-for="x in 12"
      :key="x"
      cols="12"
    >
      <v-img
        :src="'https://picsum.photos/1920/1080?random=' + x"
        max-height="600"
      />
    </v-col>
  </div>
</template>

<script>
import { defineComponent } from 'vue';

export default defineComponent({
  name: 'HomeView',

  components: {},
});
</script>
