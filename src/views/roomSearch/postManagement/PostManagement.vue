<template>
  <v-container class="post-management">
    <v-col class="pa-4">
      <v-sheet class="text-h4 mb-4">Quản lý bài đăng</v-sheet>
      <post-overview
        v-for="(item, index) in postDetails"
        :key="index"
        :item="item"
      ></post-overview>
    </v-col>
  </v-container>
</template>

<script>
import { usePostManagement } from "./postManagement";
import PostOverview from "@/components/views/PostOverview.vue";

export default {
  name: "PostManagement",
  components: {
    PostOverview,
  },
  setup() {
    const resource = usePostManagement();
    return resource;
  },
};
</script>

<style lang="scss">
@import "./PostManagement";
</style>