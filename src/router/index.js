import { createRouter, createWebHistory } from "vue-router";

// init routes
// Thực hiện load động components => Tránh load thừa dữ liệu
const router = createRouter({
  history: createWebHistory(),
  routes: [
    {
      name: "Homepage",
      path: "",
      redirect: "/trang-chu",
      component: () => import("@/components/layout/roomSearch/Container.vue"),
      meta: { requiresAuth: true },
      children: [
        {
          path: "/trang-chu",
          name: "RoomSearchView",
          component: () => import("@/views/roomSearch/main/MainView.vue"),
        },
        {
          path: "/post/:id",
          name: "PostDetail",
          meta: { requiresAuth: true },
          component: () =>
            import("@/views/roomSearch/postDetail/PostDetail.vue"),
        },
      ],
    },
    {
      path: "/tai-khoan",
      redirect: "tai-khoan/dang-bai",
      name: "Account",
      component: () => import("@/components/layout/account/Container.vue"),
      children: [
        {
          path: "/tai-khoan/dang-bai",
          name: "PostDetailPopup",
          component: () =>
            import("@/views/roomSearch/postDetail/PostDetailPopup.vue"),
        },
        {
          path: "/tai-khoan/quan-ly-bai-dang",
          name: "PostManagement",
          query: { tab: 1 },
          component: () =>
            import("@/views/roomSearch/postManagement/PostManagement.vue"),
        },
        {
          path: "/tai-khoan/quan-ly-tai-khoan",
          name: "InfoUpdating",
          component: () => import("@/views/auth/updating/InfoUpdating.vue"),
        },
        {
          path: "/tai-khoan/lich-hen",
          name: "AppointmentSchedule",
          component: () =>
            import("@/views/auth/schedule/AppointmentSchedule.vue"),
        },
      ],
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

router.beforeEach((to, from, next) => {
  // log ra tên trang được mở
  console.log(to.name);

  if (to.meta.requiresAuth && !isLoggedIn()) {
    next("/auth/login");
  } else {
    next();
  }
});

const isLoggedIn = () => {
  // Kiểm tra xem người dùng đã đăng nhập chưa
  // Trả về true nếu đã đăng nhập, ngược lại trả về false
  const context = localStorage.getItem("context");
  if (context) {
    const contextObj = JSON.parse(context);
    if (contextObj.accessToken == "123456789") {
      return true;
    }
  }
  return false;
};

export default router;
