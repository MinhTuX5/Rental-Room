import { createRouter, createWebHistory } from "vue-router";
// Pages
import NotFound from "@/pages/NotFound.vue";
// Layout
import RoomSearchContainer from "@/components/layout/roomSearch/Container.vue";
// Auth
import Auth from "@/views/auth/Auth.vue";
import LoginView from "@/views/auth/login/Login.vue";
import RegisterView from "@/views/auth/register/Register.vue";
// Room Search
import RoomSearchView from "@/views/roomSearch/main/MainView.vue";
import PostDetail from "@/views/roomSearch/postDetail/PostDetail.vue";

// init routes
const routes = [
  { path: "/:pathMatch(.*)*", name: "not-found", component: NotFound },
  {
    path: "/",
    component: RoomSearchContainer,
    children: [
      {
        path: "",
        name: "RoomSearchView",
        component: RoomSearchView,
      },
      {
        path: "/1",
        name: "PostDetail",
        component: PostDetail,
      },
    ],
  },
  {
    path: "/auth",
    component: Auth,
    children: [
      {
        path: "login",
        name: "LoginView",
        component: LoginView,
      },
      {
        path: "register",
        name: "RegisterView",
        component: RegisterView,
      },
    ],
  },
];

const router = createRouter({
  history: createWebHistory(),
  routes,
});

export default router;
