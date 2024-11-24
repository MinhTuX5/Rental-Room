<template>
  <v-layout>
    <!-- Header -->
    <!-- <v-app-bar><v-header :height="headerHeight" /></v-app-bar> -->
    <!-- left nav -->
    <v-navigation-drawer ref="nav" theme="dark" permanent :width="navWidth">
      <div class="pa-2">
        <router-link to="/">
          <v-btn block color="orange-darken-1">
            <v-icon icon="mdi-home" start></v-icon> Trang chủ
          </v-btn>
        </router-link>
      </div>
      <v-list nav @update:selected="handleUpdateSelected">
        <v-list-item
          v-for="item in features"
          :key="item.title"
          :title="item.title"
          :value="item.componentId"
          :active="item.active"
        ></v-list-item>
      </v-list>
      <template #append>
        <div class="pa-2">
          <v-btn block color="red" class="mt-2"> Đăng xuất </v-btn>
        </div>
      </template>
    </v-navigation-drawer>

    <!-- Main content -->
    <v-main>
      <component :is="componentId"></component>
    </v-main>
  </v-layout>
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