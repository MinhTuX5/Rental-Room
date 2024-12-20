<template>
  <v-container class="post-management">
    <v-tabs v-model="tab" class="mb-4">
      <v-tab :value="1">Bài đã đăng</v-tab>
      <v-tab :value="2">Bài đã lưu</v-tab>
    </v-tabs>
    <v-tabs-window v-model="tab">
      <v-tabs-window-item :value="1">
        <v-virtual-scroll
          v-if="postedPosts.length > 0"
          :items="postedPosts"
          :height="heightOfList"
        >
          <template v-slot:default="{ item }">
            <post-overview
              :item="item"
              :isShowLikeIcon="false"
              :isShowFeatureBtn="true"
              @delete="onAfterDelete"
            ></post-overview>
          </template>
        </v-virtual-scroll>
        <v-empty-state
          v-else
          title="Chưa có bài viết nào được đăng!"
          image="/src/assets/imgs/common/empty.png"
        ></v-empty-state>
      </v-tabs-window-item>
      <v-tabs-window-item :value="2">
        <v-virtual-scroll :items="savedPosts" :height="heightOfList">
          <template v-slot:default="{ item }">
            <post-overview
              :item="item"
              :isShowLikeIcon="false"
              :isShowFeatureBtn="true"
              @delete="onAfterDelete"
            ></post-overview>
          </template>
        </v-virtual-scroll>
      </v-tabs-window-item>
    </v-tabs-window>
  </v-container>
</template>

<script>
// base
import baseList from "@/views/base/baseList";

import { usePostManagement } from "./postManagement";
import PostOverview from "@/components/views/postOverview/PostOverview.vue";

export default {
  name: "PostManagement",
  extends: baseList,
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