import { defineStore } from "pinia";
// base
import BaseStore from "@/stores/baseStore";
// api
import api from "@/apis/roomSearchAPI/roomPostAPI";

const store = new BaseStore(api);
export const useRoomPostStore = defineStore("RoomPost", {
  state: () => ({ ...store.state, idField: "room_post_id" }),
  getters: {},
  actions: {
    ...store.actions,
    lovePost: async (param) => {
      if (!param) {
        return;
      }

      const res = await api.lovePost(param);
      return res.data?.data;
    },

    getMyPosts: async (param) => {
      if (!param) {
        return;
      }

      const res = await api.getMyPosts(param);
      return res?.data;
    },

    getMyFavoritePosts: async (param) => {
      if (!param) {
        return;
      }

      const res = await api.getMyFavoritePosts(param);
      return res;
    },

    saveLocation: async (entity) => {
      return await api.saveLocation(entity);
    },

    linkToInnkeeper: async (payload) => {
      return await api.linkToInnkeeper(payload);
    },
    async cancelLinkToInnkeeper() {
      return await api.cancelLinkToInnkeeper();
    },
    async getRoomPostByRoomId(roomId) {
      return await api.getRoomPostByRoomId(roomId);
    },
    async genPostsFromManagement(payload) {
      return await api.genPostsFromManagement(payload);
    },
    async updatePostStatus(payload) {
      return await api.updatePostStatus(payload);
    },
  },
});
