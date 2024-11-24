<template>
  <v-row
    align="center"
    class="header position-sticky top-0"
    :style="{ height: height + 'px' }"
  >
    <v-col cols="2">
      <v-btn class="ma-2" color="orange-darken-2" @click="show(Pages.Home.key)">
        <v-icon icon="mdi-home" start></v-icon>
        {{ Pages.Home.displayName }}
      </v-btn>
    </v-col>
    <v-col cols="5" class="pt-0 pb-0 d-flex justify-center">
      <v-btn class="mr-2" variant="plain" @click="openManagePage"
        >Quản lý phòng trọ</v-btn
      >
      <v-btn class="mr-2" variant="plain">Giới thiệu</v-btn>
    </v-col>

    <v-col cols="5">
      <v-sheet class="d-flex justify-end">
        <router-link
          :to="{ name: 'Account', params: { path: 'quan-ly-bai-dang' } }"
        >
          <v-btn prepend-icon="mdi-text-box-multiple-outline"
            >Quản lý bài đăng</v-btn
          >
        </router-link>
        <router-link v-for="page in iconPages" :key="page.name" :to="page.path">
          <v-btn density="comfortable" class="ml-2" :icon="page.icon" />
        </router-link>
        <router-link :to="{ name: 'Account', params: { path: 'dang-bai' } }">
          <v-btn prepend-icon="mdi-note-plus-outline" class="ml-2" color="red"
            >Đăng bài</v-btn
          >
        </router-link>
      </v-sheet>
    </v-col>
  </v-row>
</template>

<script>
import { getCurrentInstance, ref } from "vue";
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

    const iconPages = [
      { name: "Favorites", path: "/favorite", icon: "mdi-book-heart-outline" },
      { name: "Information", path: "/info", icon: "mdi-bell-outline" },
      { name: "Account", path: "/account", icon: "mdi-account-circle" },
    ];

    const Pages = {
      Home: { key: "Home", displayName: "Trang chủ", path: "/" },
      Detail: { key: "Detail", displayName: "Đăng bài", path: "/account" },
    };

    const show = (pageName) => {
      const me = proxy;

      const pageKeys = Object.keys(Pages);

      if (pageKeys.includes(pageName)) {
        const selectedPage = Pages[pageName];
        me.$router?.push(selectedPage.path);
        console.log("Show page:", pageName);
      } else {
        console.log("Page not found:", pageName);
      }
    };

    const openManagePage = () => {
      const originLink = window.location.origin;
      const managementLink = `${originLink}/auth/login`;
      const newTab = window.open(managementLink, "_blank");
      newTab.previousTabData = {
        isManagementPage: true,
      }
      newTab.focus();
    };

    return {
      tabsConfig,
      iconPages,
      show,
      Pages,
      openManagePage
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