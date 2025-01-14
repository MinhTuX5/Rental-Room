<template>
  <v-container class="post-management">
    <v-tabs v-model="tabIndex" class="mb-4" @update:modelValue="onChangeTab">
      <v-tab :value="PostStatus.Posted">Bài đã đăng</v-tab>
      <v-tab :value="PostStatus.Saved">Bài đã lưu</v-tab>
      <v-tab :value="PostStatus.WaitingForApproval">Chờ phê duyệt</v-tab>
      <v-tab :value="tabVals.favoritePosts">Yêu thích</v-tab>
    </v-tabs>
    <v-tabs-window v-model="tabIndex">
      <v-tabs-window-item :value="PostStatus.Posted">
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
              :displayed-btns="[featureBtns.Delete, featureBtns.Hide]"
              @delete="onAfterDelete"
            ></post-overview>
          </template>
        </v-virtual-scroll>
        <v-skeleton-loader
          v-else-if="loading"
          type="table-tbody"
        ></v-skeleton-loader>
        <v-empty-state
          v-else
          title="Chưa có bài viết nào được đăng!"
          image="/src/assets/imgs/common/empty.png"
        ></v-empty-state>
      </v-tabs-window-item>
      <v-tabs-window-item :value="PostStatus.Saved">
        <v-virtual-scroll
          v-if="savedPosts.length > 0"
          :items="savedPosts"
          :height="heightOfList"
        >
          <template v-slot:default="{ item }">
            <post-overview
              :item="item"
              :isShowLikeIcon="false"
              :isShowFeatureBtn="true"
              :displayed-btns="[featureBtns.Delete, featureBtns.Post]"
              @delete="onAfterDelete"
            ></post-overview>
          </template>
        </v-virtual-scroll>
        <v-skeleton-loader
          v-else-if="loading"
          type="table-tbody"
        ></v-skeleton-loader>
        <v-empty-state
          v-else
          title="Chưa có bài viết nào được lưu!"
          image="/src/assets/imgs/common/empty.png"
        ></v-empty-state>
      </v-tabs-window-item>
      <v-tabs-window-item :value="tabVals.favoritePosts">
        <v-virtual-scroll
          v-if="favoritePosts.length > 0"
          :items="favoritePosts"
          :height="heightOfList"
        >
          <template v-slot:default="{ item }">
            <post-overview
              :item="item"
              @unlikePost="onUnLikePost"
            ></post-overview>
          </template>
        </v-virtual-scroll>
        <v-skeleton-loader
          v-else-if="loading"
          type="table-tbody"
        ></v-skeleton-loader>
        <v-empty-state
          v-else
          title="Chưa có bài viết yêu thích nào!"
          image="/src/assets/imgs/common/empty.png"
        ></v-empty-state>
      </v-tabs-window-item>
      <v-tabs-window-item :value="PostStatus.WaitingForApproval">
        <v-virtual-scroll
          v-if="waitingPosts.length > 0"
          :items="waitingPosts"
          :height="heightOfList"
        >
          <template v-slot:default="{ item }">
            <post-overview
              :item="item"
              :isShowLikeIcon="false"
              :isShowFeatureBtn="true"
              :displayed-btns="[featureBtns.Delete]"
              @delete="onAfterDelete"
            ></post-overview>
          </template>
        </v-virtual-scroll>
        <v-skeleton-loader
          v-else-if="loading"
          type="table-tbody"
        ></v-skeleton-loader>
        <v-empty-state
          v-else
          title="Không có bài viết nào chờ phê duyệt!"
          image="/src/assets/imgs/common/empty.png"
        ></v-empty-state>
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
  props: {
    postStatus: {
      type: Boolean,
      default: null,
    },
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