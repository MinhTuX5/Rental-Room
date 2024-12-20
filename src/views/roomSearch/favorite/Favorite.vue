<template>
  <v-container>
    <v-col class="pa-4">
      <v-sheet class="text-h4 mb-4">Bài đăng yêu thích</v-sheet>
      <post-overview
        v-for="(item, index) in postDetails"
        :key="index"
        :item="item"
      ></post-overview>
    </v-col>
  </v-container>
</template>

<script>
import { useFavorite } from "./favorite";
import PostOverview from "@/components/views/postOverview/PostOverview.vue";

export default {
  name: "MyFavorite",
  components: {
    PostOverview,
  },
  setup() {
    const resource = useFavorite();
    return resource;
  },
};
</script>

<style lang="scss">
@import "./Favorite";
</style>