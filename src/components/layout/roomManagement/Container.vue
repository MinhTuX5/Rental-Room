<template>
  <v-layout class="room-management-container">
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
        <v-app-bar-nav-icon @click.stop="rail = !rail"></v-app-bar-nav-icon>
      </template>

      <v-app-bar-title>Quản lý phòng trọ</v-app-bar-title>

      <v-spacer></v-spacer>

      <!-- Thông báo -->
      <v-badge color="error" :content="notificationList.length" class="mr-4" @click="getNotifications">
        <v-icon
          id="notification"
          size="large"
          v-tooltip:top="'Thông báo'"
          class="cursor-pointer"
          >mdi-bell-outline</v-icon
        >
      </v-badge>

      <v-menu activator="#notification">
        <v-card class="mx-auto" max-width="450">
          <v-list :items="notificationList" lines="three" item-props>
            <template v-slot:subtitle="{ subtitle }">
              <div v-html="subtitle"></div>
            </template>
          </v-list>
        </v-card>
      </v-menu>

      <v-btn icon id="menu-activator" class="menu">
        <v-icon>mdi-dots-vertical</v-icon>
      </v-btn>

      <v-menu activator="#menu-activator">
        <v-list>
          <v-list-item
            v-for="(item, index) in menuItems"
            :key="index"
            :value="index"
            class="cursor-pointer"
            @click="item.onClick"
          >
            <v-list-item-title
              ><v-icon :icon="item.icon" class="mr-2" />
              {{ item.title }}</v-list-item-title
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
            v-if="!item.isGroup && !item.isHide"
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
          <v-list-group v-else-if="!item.isHide" :value="item.parentVal">
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
  </v-layout>
  <v-dialog v-model="showPopup" width="auto">
    <v-card
      width="500"
      prepend-icon="mdi-link"
      title="Liên kết đến tòa nhà"
      text="Yêu cầu sẽ được gửi đến chủ trọ để chờ xác nhận"
    >
      <v-card-item>
        <v-row>
          <v-col>
            <v-text-field
              clearable
              label="Số diện thoại chủ phòng"
              class="mt-2"
              variant="outlined"
              color="blue-lighten-3"
              :autofocus="true"
              v-model="phoneNumber"
          /></v-col>
          <v-col class="ml-4">
            <v-text-field
              clearable
              label="Mã tòa nhà"
              class="mt-2"
              variant="outlined"
              color="blue-lighten-3"
              v-model="buildingCode"
            />
          </v-col>
        </v-row>
      </v-card-item>
      <template v-slot:actions>
        <v-btn
          class="ms-auto"
          text="Gửi yêu cầu"
          color="orange-lighten-2"
          @click="onLinkToBuilding"
        ></v-btn>
      </template>
    </v-card>
  </v-dialog>
</template>

<script>
// base
import baseView from "@/views/base/baseView";
// resources
import { useContainer } from "./container";

export default {
  extends: baseView,
  name: "AccountContainer",
  components: {},

  setup() {
    const resource = useContainer();
    return resource;
  },
};
</script>

<style lang="scss">
.room-management-container {
  .v-list-item__spacer {
    width: 8px !important;
  }
}
</style>