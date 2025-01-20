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
              @hidePost="hidePost"
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
        <v-row v-if="isLinked" class="d-flex justify-end mb-4"
          ><v-btn
            color="blue"
            prepend-icon="mdi-note-plus-outline"
            @click="showDialog = true"
            >Sinh bài đăng</v-btn
          ></v-row
        >
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
              :displayed-btns="[
                featureBtns.Delete,
                featureBtns.Post,
                featureBtns.Edit,
              ]"
              @delete="onAfterDelete"
              @onPost="onPost"
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
              :displayed-btns="[
                featureBtns.Delete,
                featureBtns.Edit,
                featureBtns.Hide,
              ]"
              @delete="onAfterDelete"
              @hidePost="hidePost"
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
    <v-overlay :model-value="overlay" class="align-center justify-center">
      <v-progress-circular
        color="primary"
        size="64"
        indeterminate
      ></v-progress-circular>
    </v-overlay>
  </v-container>
  <v-dialog v-model="showDialog" width="auto">
    <v-card
      :width="400"
      :prepend-icon="'mdi-note-plus-outline'"
      :title="'Sinh bài đăng'"
      :text="'Dữ liệu lấy từ trang quản lý đã liên kết'"
    >
      <v-card-item>
        <v-row>
          <v-number-input
            class="mt-2"
            variant="outlined"
            controlVariant="stacked"
            :reverse="false"
            :inset="true"
            :min="0"
            v-model="buildingCode"
          ></v-number-input>
        </v-row>
      </v-card-item>
      <template v-slot:actions>
        <v-btn
          :disabled="!buildingCode"
          class="ms-auto"
          :text="'Thực hiện'"
          color="orange-lighten-2"
          @click="genPostsFromManagement"
        ></v-btn>
      </template>
    </v-card>
  </v-dialog>
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