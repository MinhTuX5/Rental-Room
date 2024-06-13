import { defineAsyncComponent } from "vue";

const PostDetailPopup = defineAsyncComponent(() =>
  import("@/views/roomSearch/postDetail/PostDetailPopup.vue")
);

export function registerPopup(app) {
  app.component("PostDetailPopup", PostDetailPopup);
}
