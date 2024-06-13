<template>
  <v-row
    align="center"
    class="header position-sticky top-0"
    :style="{ height: height + 'px' }"
  >
    <v-col cols="2">
      <v-sheet> Home </v-sheet>
    </v-col>
    <v-col cols="5" class="pt-0 pb-0">
      <v-tab :data="tabsConfig"></v-tab>
    </v-col>
    <v-col cols="5">
      <v-sheet class="d-flex justify-end">
        <v-btn prepend-icon="mdi-text-box-multiple-outline"
          >Quản lý bài đăng</v-btn
        >
        <v-btn
          density="comfortable"
          class="ml-2"
          icon="mdi-book-heart-outline"
        ></v-btn>
        <v-btn
          density="comfortable"
          class="ml-2"
          icon="mdi-bell-outline"
        ></v-btn>
        <v-btn
          density="comfortable"
          class="ml-2"
          icon="mdi-account-circle"
        ></v-btn>
        <v-btn prepend-icon="mdi-note-plus-outline" class="ml-2" color="red"
          >Đăng bài</v-btn
        >
      </v-sheet>
    </v-col>
  </v-row>
</template>

<script>
export default {
  props: {
    height: {
      type: [Number, String],
      default: "70",
    },
  },
  setup() {
    const tabsConfig = [
      { display: "Tìm trọ" },
      { display: "Quản lý trọ" },
      { display: "Giới thiệu" },
    ];

    return {
      tabsConfig,
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
}
</style>