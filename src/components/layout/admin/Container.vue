<template>
  <v-layout class="admin-container">
    <!-- Header -->
    <v-app-bar
      ref="VHeader"
      color="teal-darken-4"
      image="https://picsum.photos/1920/1080?random"
    >
      <template v-slot:image>
        <v-img
          gradient="to top right, rgba(19,84,122,.8), rgba(128,208,199,.8)"
        ></v-img>
      </template>

      <template v-slot:prepend>
        <v-app-bar-nav-icon @click.stop="rail = !rail" />
      </template>

      <v-app-bar-title>Quản trị viên</v-app-bar-title>

      <v-spacer></v-spacer>

      <v-btn icon id="menu-activator" class="menu">
        <v-icon>mdi-dots-vertical</v-icon>
      </v-btn>

      <v-menu activator="#menu-activator">
        <v-list>
          <v-list-item
            v-for="(item, index) in menuItems"
            :key="index"
            :value="index"
            @click="item.onClick"
          >
            <v-list-item-title>
              <v-icon :icon="item.icon" /> {{ item.title }}</v-list-item-title
            >
          </v-list-item>
        </v-list>
      </v-menu>
    </v-app-bar>

    <!-- left nav -->
    <v-navigation-drawer
      ref="nav"
      theme="dark"
      permanent
      :rail="rail"
      @click="rail = false"
    >
      <v-list nav :opened="open" @update:selected="handleSelected">
        <div v-for="item in features" :key="item.title">
          <v-list-item
            v-if="!item.isGroup"
            :title="item.title"
            :value="item.componentId"
            :active="item.active"
          >
            <template v-slot:prepend>
              <v-icon
                :icon="item.icon"
                v-tooltip:end="item.title"
              ></v-icon> </template
          ></v-list-item>
          <v-list-group v-else :value="item.parentVal">
            <template #activator="{ props }">
              <v-list-item
                v-bind="props"
                :prepend-icon="item.icon"
                :title="item.title"
              ></v-list-item>
            </template>
            <v-list-item
              v-for="child in item.children"
              :key="child.title"
              :title="child.title"
              :value="child.componentId"
              :active="child.active"
            >
              <template #prepend>
                <v-icon :icon="child.icon"></v-icon> </template
            ></v-list-item>
          </v-list-group>
        </div>
      </v-list>
    </v-navigation-drawer>

    <!-- Main content -->
    <v-main ref="main" class="h-screen">
      <router-view :height-of-app-header="$refs.VHeader?.$el.clientHeight" />
    </v-main>
    <v-dialog v-model="showPopup" width="auto">
      <v-card width="500" prepend-icon="mdi-lock-reset" title="Đổi mật khẩu">
        <v-card-item>
          <PasswordUpdating class="admin-password-updating" />
        </v-card-item>
      </v-card>
    </v-dialog>
  </v-layout>
</template>

<script>
import PasswordUpdating from "@/views/auth/updating/PasswordUpdating.vue";

import { useContainer } from "./container";
import baseView from "../../../views/base/baseView";

export default {
  extends: baseView,
  name: "AdminContainer",
  components: {
    PasswordUpdating,
  },

  setup() {
    const resource = useContainer();
    return resource;
  },
};
</script>

<style lang="scss">
.admin-password-updating {
  max-width: unset;

  .submit-btn {
    display: flex;
    justify-content: center;
  }
}
</style>