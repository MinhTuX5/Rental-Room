import { createRouter, createWebHistory } from "vue-router";
import Role from "../common/enum/Role";

// init routes
// Thực hiện load động components => Tránh load thừa dữ liệu
const router = createRouter({
  history: createWebHistory(),
  routes: [
    {
      path: "/dang-nhap",
      name: "Login",
      component: () => import("@/views/auth/login/Login.vue"),
    },
    {
      name: "HomePage",
      path: "",
      redirect: "/trang-chu",
      component: () => import("@/components/layout/roomSearch/Container.vue"),
      children: [
        {
          path: "/trang-chu",
          name: "RoomSearchView",
          component: () => import("@/views/roomSearch/main/MainView.vue"),
        },
        {
          path: "bai-dang/:id",
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
      meta: { requiresAuth: true },
      component: () => import("@/components/layout/account/Container.vue"),
      children: [
        {
          path: "/tai-khoan/dang-bai",
          name: "PostDetailPopup",
          meta: { roles: [Role.RoomSeeker] },
          component: () =>
            import("@/views/roomSearch/postDetail/PostDetailPopup.vue"),
        },
        {
          path: "/tai-khoan/quan-ly-bai-dang",
          name: "PostManagement",
          query: { tab: 1 },
          meta: { roles: [Role.RoomSeeker] },
          component: () =>
            import("@/views/roomSearch/postManagement/PostManagement.vue"),
        },
        {
          meta: { roles: [Role.RoomSeeker] },
          path: "/tai-khoan/quan-ly-tai-khoan",
          name: "InfoUpdating",
          component: () => import("@/views/auth/updating/InfoUpdating.vue"),
        },
        {
          meta: { roles: [Role.RoomSeeker] },
          path: "/tai-khoan/lich-hen",
          name: "AppointmentSchedule",
          component: () =>
            import("@/views/auth/schedule/AppointmentSchedule.vue"),
        },
      ],
    },
    {
      path: "/quan-ly",
      name: "Management",
      redirect: "/quan-ly/danh-sach-phong",
      meta: { requiresAuth: true, localContextKey: "context_management" },
      component: () =>
        import("@/components/layout/roomManagement/Container.vue"),
      children: [
        {
          path: "danh-sach-phong",
          name: "RoomListOverview",
          component: () =>
            import(
              "@/views/roomManagement/roomListOverview/RoomListOverview.vue"
            ),
        },
        // {
        //   path: "chi-tiet-phong/:roomID",
        //   name: "Management_PostDetail",
        //   component: () =>
        //     import("@/views/roomSearch/postDetail/PostDetailPopup.vue"),
        // },
        {
          path: "thong-tin-phong",
          name: "RoomInfo",
          component: () =>
            import("@/views/roomManagement/renter/roomInfo/RoomInfo.vue"),
        },
        {
          path: "ho-gia-dinh",
          name: "HouseholdList",
          component: () =>
            import(
              "@/views/roomManagement/innkeeper/household/HouseholdList.vue"
            ),
        },
        {
          path: "thu-phi",
          name: "FeeList",
          component: () =>
            import("@/views/roomManagement/innkeeper/fee/FeeList.vue"),
        },
        {
          path: "danh-muc",
          name: "Dictionary",
          redirect: "danh-muc/toa-nha",
          children: [
            {
              path: "toa-nha",
              name: "BuildingList",
              component: () =>
                import(
                  "@/views/roomManagement/innkeeper/dictionary/building/BuildingList.vue"
                ),
            },
            {
              path: "phi-gui-xe",
              name: "VehicleFeeList",
              component: () =>
                import(
                  "@/views/roomManagement/innkeeper/dictionary/vehicle/VehicleFeeList.vue"
                ),
            },
            {
              path: "phi-dich-vu",
              name: "ServiceFeeList",
              component: () =>
                import(
                  "@/views/roomManagement/innkeeper/dictionary/service/ServiceFeeList.vue"
                ),
            },
            {
              path: "loai-phong",
              name: "RoomCategoryList",
              component: () =>
                import(
                  "@/views/roomManagement/innkeeper/dictionary/roomCategory/RoomCategoryList.vue"
                ),
            },
            {
              path: "phong",
              name: "RoomList",
              component: () =>
                import(
                  "@/views/roomManagement/innkeeper/dictionary/room/RoomList.vue"
                ),
            },
            {
              path: "hop-dong",
              name: "ContractList",
              component: () =>
                import(
                  "@/views/roomManagement/innkeeper/dictionary/contract/ContractList.vue"
                ),
            },
            {
              path: "nguoi-thue",
              name: "ResidentList",
              component: () =>
                import(
                  "@/views/roomManagement/innkeeper/dictionary/resident/ResidentList.vue"
                ),
            },
          ],
        },
      ],
    },
    {
      path: "/auth",
      component: () => import("@/views/auth/Auth.vue"),
      children: [
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
      path: "/admin",
      name: "Admin",
      // redirect: "/phe-duyet",
      meta: {
        requiresAuth: true,
        localContextKey: "context_admin",
        isAdmin: true,
      },
      component: () => import("@/components/layout/admin/Container.vue"),
      children: [
        {
          path: "phe-duyet",
          name: "PostApproval",
          component: () => import("@/views/admin/PostApproval.vue"),
        },
        {
          path: "phe-duyet-bai-dang/:id",
          name: "PostDetailApproval",
          component: () =>
            import("@/views/roomSearch/postDetail/PostDetail.vue"),
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

router.beforeEach(async (to, from, next) => {
  
  const requireAuth = to.matched.find((match) => match.meta.requiresAuth);
  if (requireAuth) {
    let isSignIn = isLoggedIn(requireAuth.meta.localContextKey);
    if (isSignIn) {
      next();
    } else {
      if (requireAuth.meta.isAdmin) {
        next({ name: "HomePage" });
        sessionStorage.setItem("redirectFrom", to.name);
      } else {
        next({ name: "Login" });
      }
    }
  } else {
    if (to.name == "Login") {
      let isSignIn = isLoggedIn("context_management");
      if (isSignIn) {
        next({ name: "Management" });
      } else {
        next();
      }
    } else {
      next();
    }
  }
});

// const getCurrentUser = () => {
//   return new Promise((resolve, reject) => {
//     const authListener = onAuthStateChanged(
//       getAuth(),
//       (user) => {
//         authListener();
//         resolve(user);
//       },
//       reject()
//     );
//   });
// };

const isLoggedIn = (localContextKey = "context") => {
  const context = localStorage.getItem(localContextKey);
  if (context) {
    const parsedContext = JSON.parse(context);
    if (parsedContext.token) {
      window.PageRole = parsedContext.role;
      return true;
    }
  }
  return false;
};

export default router;
