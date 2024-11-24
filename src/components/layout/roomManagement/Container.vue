<template>
  <v-layout>
    <!-- Header -->
    <v-app-bar
      color="teal-darken-4"
      image="https://picsum.photos/1920/1080?random"
    >
      <template v-slot:image>
        <v-img
          gradient="to top right, rgba(19,84,122,.8), rgba(128,208,199,.8)"
        ></v-img>
      </template>

      <template v-slot:prepend>
        <v-app-bar-nav-icon></v-app-bar-nav-icon>
      </template>

      <v-app-bar-title>Quản lý phòng trọ</v-app-bar-title>

      <v-spacer></v-spacer>

      <v-btn icon id="menu-activator" class="menu">
        <v-icon @click="console.log('nvthinh')">mdi-dots-vertical</v-icon>
      </v-btn>

      <v-menu activator="#menu-activator">
        <v-list>
          <v-list-item
            v-for="(item, index) in menuItems"
            :key="index"
            :value="index"
          >
            <v-list-item-title>{{ item.title }}</v-list-item-title>
          </v-list-item>
        </v-list>
      </v-menu>
    </v-app-bar>
    <!-- left nav -->
    <v-navigation-drawer ref="nav" theme="dark" permanent :width="navWidth">
      <v-list nav @update:selected="handleSelected">
        <v-list-item
          v-for="item in features"
          :key="item.title"
          :title="item.title"
          :value="item.componentId"
          :active="item.active"
        ></v-list-item>
      </v-list>
    </v-navigation-drawer>

    <!-- Main content -->
    <v-main ref="main" class="h-screen">
      <component
        :is="componentId"
      ></component>
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