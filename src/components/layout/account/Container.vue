<template>
  <v-layout>
    <v-navigation-drawer
      ref="nav"
      theme="dark"
      permanent
      :width="navWidth"
      v-model="drawer"
    >
      <div class="pa-2">
        <router-link to="/" class="text-decoration-none">
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
          :to="item.path"
        ></v-list-item>
      </v-list>
      <template #append>
        <div class="pa-2">
          <v-btn block color="red" class="mt-2" @click="logout">
            Đăng xuất
          </v-btn>
        </div>
      </template>
    </v-navigation-drawer>

    <v-main>
      <router-view />
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