<template>
  <v-row
    align="center"
    class="header position-sticky top-0"
    :style="{ height: height + 'px' }"
  >
    <v-col cols="2">
      <router-link :to="{ name: 'Homepage' }" class="ml-2">
        <v-btn class="ma-2" color="orange-darken-2" @click="onClickHomeBtn">
          <v-icon icon="mdi-home" start></v-icon>
          Trang chủ
        </v-btn>
      </router-link>
    </v-col>
    <v-col cols="5" class="pt-0 pb-0 d-flex justify-center">
      <v-btn class="mr-2" variant="plain" @click="openManagePage"
        >Quản lý phòng trọ</v-btn
      >
      <v-btn class="mr-2" variant="plain">Giới thiệu</v-btn>
    </v-col>

    <v-col cols="5">
      <v-sheet class="d-flex justify-end">
        <router-link :to="{ name: 'PostManagement' }">
          <v-btn prepend-icon="mdi-text-box-multiple-outline"
            >Quản lý bài đăng</v-btn
          >
        </router-link>
        <!-- Bài đăng yêu thích -->
        <router-link
          :to="{ name: 'PostManagement', query: { tab: 3 } }"
          class="ml-2"
        >
          <v-btn
            density="comfortable"
            class="ml-2"
            icon="mdi-book-heart-outline"
            v-tooltip:bottom="'Bài đăng yêu thích'"
          />
        </router-link>
        <!-- Thông báo -->
        <v-btn density="comfortable" class="ml-2" icon="mdi-bell-outline" />
        <!-- Tài khoản -->
        <router-link :to="{ name: 'InfoUpdating' }" class="ml-2">
          <v-avatar
            image="https://picsum.photos/1920/1080?random"
            size="36"
            v-tooltip:bottom="'Quản lý tài khoản'"
          ></v-avatar>
        </router-link>
        <router-link :to="{ name: 'PostDetailPopup' }">
          <v-btn prepend-icon="mdi-note-plus-outline" class="ml-2" color="red"
            >Đăng bài</v-btn
          >
        </router-link>
      </v-sheet>
    </v-col>
  </v-row>
</template>

<script>
import { getCurrentInstance } from "vue";

export default {
  props: {
    height: {
      type: [Number, String],
      default: "70",
    },
  },
  setup() {
    const { proxy } = getCurrentInstance();

    const tabsConfig = [
      { display: "Tìm trọ" },
      { display: "Quản lý trọ" },
      { display: "Giới thiệu" },
    ];

    const openManagePage = () => {
      const originLink = window.location.origin;
      const managementLink = `${originLink}/auth/login`;
      const newTab = window.open(managementLink, "_blank");
      newTab.previousTabData = {
        isManagementPage: true,
      };
      newTab.focus();
    };

    const onClickHomeBtn = () => {
      const me = proxy;
      me.$emit("onClickHomeBtn");
    };

    return {
      tabsConfig,
      openManagePage,
      onClickHomeBtn,
    };
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