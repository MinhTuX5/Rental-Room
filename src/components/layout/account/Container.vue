<template>
  <v-header :height="headerHeight" />
  <v-card>
    <v-layout>
      <v-navigation-drawer
        ref="nav"
        theme="dark"
        permanent
        :width="navWidth"
        :style="{
          top: headerHeight + 'px',
          height: 'calc(100vh - ' + headerHeight + 'px)',
        }"
      >
        <v-list nav @update:selected="handleUpdateSelected">
          <!-- prepend-icon="mdi-account-circle" -->
          <v-list-item
            v-for="item in features"
            :key="item.title"
            :title="item.title"
            :value="item.componentId"
          ></v-list-item>
        </v-list>
        <template v-slot:append>
          <div class="pa-2">
            <v-btn block color="red"> Đăng xuất </v-btn>
          </div>
        </template>
      </v-navigation-drawer>
    </v-layout>
  </v-card>
  <v-container :style="{ marginLeft: navWidth + 'px' }">
    <component :is="componentId"></component>
  </v-container>
</template>

<script>
import VHeader from "@/components/layout/roomSearch/Header.vue";

import { useContainer } from "./container";

export default {
  name: "AccountContainer",
  components: {
    VHeader,
  },

  setup() {
    const resource = useContainer();
    return resource;
  },
};
</script>

<style lang="scss">
.account-container {
}
</style>