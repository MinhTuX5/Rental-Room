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

      <v-app-bar-title>
        <v-row>
          <span>Quản lý phòng trọ</span>
          <span v-if="buildingName" class="ml-8 building-name"
            >Tòa nhà: <span class="font-italic">{{ buildingName }}</span></span
          >
        </v-row>
      </v-app-bar-title>

      <v-spacer></v-spacer>

      <!-- Thông báo -->
      <v-badge color="error" :content="newNotifications.length" class="mr-4">
        <v-icon
          id="notification"
          size="large"
          v-tooltip:top="'Thông báo'"
          class="cursor-pointer"
          @click="getNotify"
          >mdi-bell-outline</v-icon
        >
      </v-badge>

      <v-menu activator="#notification" :close-on-content-click="false">
        <v-card class="mx-auto" max-width="450">
          <v-list lines="three" @click:select="onClickNotify">
            <v-list-item
              v-for="(item, i) in notificationList"
              :key="i"
              :value="item.notification_id"
              @click="onClickNotify(item)"
            >
              <template #prepend>
                <v-avatar :image="item.user_avatar"></v-avatar>
              </template>

              <template #title>
                <div
                  v-text="item.notification_title"
                  class="font-weight-bold"
                />
              </template>

              <template #subtitle>
                <div v-html="item.notification_message" />
              </template>

              <template #default>
                <div
                  v-if="item.read_at"
                  class="d-flex justify-end font-italic opacity-50 text-subtitle-2"
                >
                  Đã xem: {{ moment(item.read_at).format("HH:mm DD/MM/YYYY") }}
                </div>
              </template>
            </v-list-item>
          </v-list>
        </v-card>
      </v-menu>

      <v-btn icon id="menu-activator" class="menu">
        <v-icon>mdi-dots-vertical</v-icon>
      </v-btn>

      <v-menu activator="#menu-activator">
        <v-list>
          <v-list-item
            v-for="(item, index) in menuItems.filter((x) => !x.isHide)"
            :key="index"
            :value="index"
            class="cursor-pointer"
            @click="onClickMenu(item)"
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
      <v-list
        v-model="selectedMenu"
        nav
        :opened="open"
        @update:selected="handleSelected"
      >
        <div v-for="item in features" :key="item.title">
          <v-list-item
            v-if="!item.isGroup && !item.isHide"
            :title="item.title"
            :value="item.componentId"
            :active="item.active"
            :to="item.path"
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
  <v-dialog v-model="showDialog" width="auto">
    <v-card
      :width="dialogConfig.width ?? 500"
      :prepend-icon="dialogConfig.icon"
      :title="dialogConfig.title"
      :text="dialogConfig.text"
    >
      <v-card-item v-if="dialogConfig.key == featureConfig.FeedBack.key">
        <v-row>
          <v-col>
            <v-text-field
              clearable
              label="Nhập phản hồi"
              class="mt-2"
              variant="outlined"
              color="blue-lighten-3"
              :autofocus="true"
              v-model="feedBackText"
          /></v-col>
        </v-row>
      </v-card-item>
      <v-card-item
        v-if="dialogConfig.key == featureConfig.LinkToRoom.key && isRenterPage"
      >
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
        </v-row>
        <v-row>
          <v-col>
            <v-text-field
              clearable
              label="Mã tòa nhà"
              class="mt-2"
              variant="outlined"
              color="blue-lighten-3"
              v-model="buildingCode"
            />
          </v-col>
          <v-col class="ml-4">
            <v-text-field
              clearable
              label="Mã phòng"
              class="mt-2"
              variant="outlined"
              color="blue-lighten-3"
              v-model="roomCode"
            />
          </v-col>
        </v-row>
      </v-card-item>
      <template v-slot:actions>
        <v-btn
          class="ms-auto"
          :text="dialogConfig.btnText"
          color="orange-lighten-2"
          @click="onSubmitDialog"
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
import moment from "moment";

export default {
  extends: baseView,
  name: "AccountContainer",
  components: {},

  setup() {
    const resource = useContainer();
    return { ...resource, moment };
  },
};
</script>

<style lang="scss">
.room-management-container {
  .v-list-item__spacer {
    width: 8px !important;
  }

  .building-name {
    font-size: 18px;
  }
}
</style>