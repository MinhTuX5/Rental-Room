import { createRouter, createWebHistory } from "vue-router";

// init routes
// Thực hiện load động components => Tránh load thừa dữ liệu
const router = createRouter({
  history: createWebHistory(),
  routes: [
    {
      name: "Homepage",
      path: "",
      component: () => import("@/components/layout/roomSearch/Container.vue"),
      children: [
        {
          path: "",
          name: "RoomSearchView",
          component: () => import("@/views/roomSearch/main/MainView.vue"),
        },
        {
          path: "/detail",
          name: "PostDetail",
          component: () =>
            import("@/views/roomSearch/postDetail/PostDetail.vue"),
        },
        {
          path: "/favorite",
          name: "Favorite",
          component: () => import("@/views/roomSearch/favorite/Favorite.vue"),
        },
      ],
    },
    {
      path: "/tai-khoan/",
      name: "Account",
      component: () => import("@/components/layout/account/Container.vue"),
      children: [],
    },
    {
      path: "/quan-ly/",
      name: "Management",
      component: () =>
        import("@/components/layout/roomManagement/Container.vue"),
      children: [],
    },
    {
      path: "/auth",
      component: () => import("@/views/auth/Auth.vue"),
      children: [
        {
          path: "login",
          name: "LoginView",
          component: () => import("@/views/auth/login/Login.vue"),
        },
        {
          path: "register",
          name: "RegisterView",
          component: () => import("@/views/auth/register/Register.vue"),
        },
        {
          path: "forgot-password",
          name: "ForgottenPassword",
          component: () =>
            import("@/views/auth/forgotPassword/ForgotPassword.vue"),
        },
      ],
    },
    {
      path: "/:pathMatch(.*)*",
      name: "not-found",
      component: () => import("@/pages/NotFound.vue"),
    },
  ],
});

export default router;
