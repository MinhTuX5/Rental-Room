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
        <v-btn
          density="comfortable"
          class="ml-2 mr-2"
          icon="mdi-bell-outline"
          v-tooltip:bottom="'Thông báo'"
        />

        <!-- Tài khoản -->
        <v-avatar
          v-if="avatarLink"
          :image="avatarLink"
          size="36"
          v-tooltip:bottom="'Quản lý tài khoản'"
          class="cursor-pointer"
          @click="moveToPage('InfoUpdating')"
        />
        <v-btn
          v-else
          density="comfortable"
          icon="mdi-account-circle"
          v-tooltip:bottom="'Quản lý tài khoản'"
          @click="moveToPage('InfoUpdating')"
        ></v-btn>

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
</template>

<script>
import { getCurrentInstance } from "vue";
import { useContextStore } from "../../../stores/contextStore";
import { useAppStore } from "../../../stores/appStore";

export default {
  props: {
    height: {
      type: [Number, String],
      default: "70",
    },
  },
  setup() {
    const { proxy } = getCurrentInstance();

    const contextStore = useContextStore();
    const appStore = useAppStore();

    const tabsConfig = [
      { display: "Tìm trọ" },
      { display: "Quản lý trọ" },
      { display: "Giới thiệu" },
    ];

    /**
     * @description Quản lý phòng trọ
     */
    const openManagePage = () => {
      const originLink = window.location.origin;
      const managementLink = `${originLink}/dang-nhap`;
      window.open(managementLink, "_blank");
    };

    const onClickHomeBtn = () => {
      const me = proxy;
      me.$emit("onClickHomeBtn");
    };

    const moveToPage = (pageName, query = {}) => {
      const me = proxy;

      if (!contextStore.$state.token) {
        appStore.toggleLoginPopup();
        appStore.$state.moveToPageAfterLogin = pageName;
        return;
      }

      me.$router.push({ name: pageName, query });
    };

    const avatarLink = contextStore.$state.user?.user_avatar;

    return {
      tabsConfig,
      openManagePage,
      onClickHomeBtn,
      moveToPage,
      avatarLink,
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