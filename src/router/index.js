import { createRouter, createWebHistory } from "vue-router";
// Pages
import NotFound from "@/pages/NotFound.vue";
// Layout
import RoomSearchContainer from "@/components/layout/roomSearch/Container.vue";
import AccountContainer from "@/components/layout/account/Container.vue";
// Auth
import Auth from "@/views/auth/Auth.vue";
import LoginView from "@/views/auth/login/Login.vue";
import RegisterView from "@/views/auth/register/Register.vue";
import ForgotPassword from "@/views/auth/forgotPassword/ForgotPassword.vue";
// Room Search
import RoomSearchView from "@/views/roomSearch/main/MainView.vue";
import PostDetail from "@/views/roomSearch/postDetail/PostDetail.vue";
import MyFavorite from "@/views/roomSearch/favorite/Favorite.vue";

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
        path: "/detail",
        name: "PostDetail",
        component: PostDetail,
      },
      {
        path: "/favorite",
        name: "Favorite",
        component: MyFavorite,
      },
    ],
  },
  {
    path: "/account",
    component: AccountContainer,
    children: [],
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
      {
        path: "forgotten-password",
        name: "ForgottenPassword",
        component: ForgotPassword,
      },
    ],
  },
];

const router = createRouter({
  history: createWebHistory(),
  routes,
});

export default router;
