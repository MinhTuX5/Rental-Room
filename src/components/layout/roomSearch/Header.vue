<template>
  <v-row
    align="center"
    class="header position-sticky top-0"
    :style="{ height: height + 'px' }"
  >
    <v-col cols="2">
      <router-link :to="{ name: 'HomePage' }" class="ml-2">
        <v-btn class="ma-2" color="orange-darken-2" @click="onClickHomeBtn">
          <v-icon icon="mdi-home" start></v-icon>
          Trang chủ
        </v-btn>
      </router-link>
    </v-col>
    <v-col cols="5" class="pt-0 pb-0 d-flex justify-center">
      <v-btn class="mr-2" variant="plain" color="black" @click="openManagePage"
        >Quản lý phòng trọ</v-btn
      >
    </v-col>

    <v-col cols="5">
      <v-sheet class="d-flex justify-end">
        <v-btn
          prepend-icon="mdi-text-box-multiple-outline"
          @click="moveToPage('PostManagement')"
          >Quản lý bài đăng</v-btn
        >

        <!-- Bài đăng yêu thích -->
        <v-btn
          density="comfortable"
          class="ml-2"
          icon="mdi-book-heart-outline"
          v-tooltip:bottom="'Bài đăng yêu thích'"
          @click="moveToPage('PostManagement', { tab: 3 })"
        />

        <!-- Thông báo -->
        <v-badge
          color="error"
          :content="notificationList.filter((x) => !x.read_at).length"
          class="mr-4"
        >
          <v-btn
            id="notification"
            density="comfortable"
            class="ml-2 mr-2"
            icon="mdi-bell-outline"
            v-tooltip:bottom="'Thông báo'"
            @click="onClickNotifyBtn"
          />
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
                <!-- <template #prepend>
                  <v-avatar
                    image="https://picsum.photos/1920/1080?random"
                  ></v-avatar>
                </template> -->

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
                    Đã xem:
                    {{ moment(item.read_at).format("HH:mm DD/MM/YYYY") }}
                  </div>
                </template>
              </v-list-item>
            </v-list>
          </v-card>
        </v-menu>

        <!-- Tài khoản -->

        <v-avatar
          v-if="avatarLink"
          :image="avatarLink"
          size="36"
          class="cursor-pointer account"
          @click="moveToPage('InfoUpdating')"
        />
        <v-btn
          v-else
          class="account"
          density="comfortable"
          icon="mdi-account-circle"
          @click="moveToPage('InfoUpdating')"
        />
        <v-menu open-on-hover activator=".account">
          <v-list>
            <v-list-item
              v-for="(item, index) in menuItems.filter((x) => !x.hide)"
              :key="index"
              :value="index"
              class="cursor-pointer"
              @click="onClickMenu(item.key)"
            >
              <v-list-item-title
                ><v-icon :icon="item.icon" class="mr-2" />
                {{ item.title }}</v-list-item-title
              >
            </v-list-item>
          </v-list>
        </v-menu>

        <v-btn
          prepend-icon="mdi-note-plus-outline"
          class="ml-2 mr-4"
          color="red"
          @click="moveToPage('PostDetailPopup')"
          >Đăng bài</v-btn
        >
      </v-sheet>
    </v-col>
  </v-row>
  <v-dialog v-model="showDialog" width="auto">
    <v-card
      :width="dialogConfig.width ?? 500"
      :prepend-icon="dialogConfig.icon"
      :title="dialogConfig.title"
      :text="dialogConfig.text"
    >
      <v-card-item>
        <v-row v-if="dialogConfig.key == featureConfig.LinkToInnkeeper.key">
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
import { useHeader } from "./header";

export default {
  props: {
    height: {
      type: [Number, String],
      default: "70",
    },
  },
  setup() {
    const resource = useHeader();
    return resource;
  },
};
</script>

<style lang="scss" scoped>
.header {
  border: 1px solid #ccc;
  margin: unset;
  z-index: 1;
  background-color: #fff;

  .tabs {
    height: 100%;
    border: 1px solid #ccc;
  }
}
</style>