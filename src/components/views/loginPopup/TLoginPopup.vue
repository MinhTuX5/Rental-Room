<template>
  <v-container class="login-popup" :class="containerClass">
    <div class="h-100 w-100 background" @click="onClickOut"></div>
    <v-form
      fast-fail
      class="w-50 d-flex flex-column justify-center bg-white pa-8 rounded-lg"
      v-model="form"
    >
      <div class="form-title text-h4 text-center mb-6">Đăng nhập</div>

      <v-col>
        <v-text-field
          v-model="model.account"
          label="Số điện thoại*"
          required
          :rules="phoneNumberRules"
        ></v-text-field>

        <v-text-field
          v-model="model.password"
          required
          label="Mật khẩu*"
          class="mt-2"
          :type="showPassword ? 'text' : 'password'"
          :append-icon="
            showPassword ? 'mdi-eye-outline' : 'mdi-eye-off-outline'
          "
          :rules="passwordRules"
          @click:append="showPassword = !showPassword"
        ></v-text-field>

        <v-select
          v-if="!isRoleFixed"
          v-model="model.role"
          :items="loginRoles"
          item-title="label"
          item-value="value"
          label="Vai trò*"
          density="compact"
          class="mt-2"
          hide-details
        ></v-select>
      </v-col>

      <div class="forgot-password text-end">
        <a href="#">Quên mật khẩu?</a>
      </div>

      <v-btn
        class="mx-auto mt-4"
        @click="login"
        color="green-lighten-1"
        :disabled="!form"
      >
        Đăng nhập
      </v-btn>

      <div v-show="model.role != Role.Admin" class="register text-center mt-4">
        <span>Chưa có tài khoản? </span>
        <a href="#">Đăng ký</a>
      </div>

      <v-col
        v-if="model.role != Role.Admin"
        class="d-flex flex-column justify-center"
      >
        <v-btn
          class="mx-auto mt-4"
          color="red-lighten-1"
          prepend-icon="mdi-google"
          @click="signInWithGoogle"
        >
          Tiếp tục với Google
        </v-btn>

        <v-btn
          class="mx-auto mt-2"
          color="blue-lighten-1"
          prepend-icon="mdi-facebook"
          @click="signInWithFb"
        >
          Tiếp tục với Facebook
        </v-btn>
      </v-col>
    </v-form>
  </v-container>
  <v-overlay :model-value="overlay" class="align-center justify-center">
    <v-progress-circular
      color="primary"
      size="64"
      indeterminate
    ></v-progress-circular>
  </v-overlay>
</template>


<script>
import { onMounted, reactive, ref, computed, getCurrentInstance, onUnmounted } from "vue";
import {
  getAuth,
  GoogleAuthProvider,
  signInWithPopup,
  FacebookAuthProvider,
} from "firebase/auth";
// api
import api from "@/apis/userAPI";
// resources
import { showMessage, MessageType } from "@/common/commonFunction";
import Role from "@/common/enum/Role";
// store
import { useAppStore } from "../../../stores/appStore";
import { useContextStore } from "../../../stores/contextStore";
import { useContextAdminStore } from "../../../stores/contextAdminStore";
import { useContextManageStore } from "@/stores/contextManageStore";
// base
import baseView from "../../../views/base/baseView";

export default {
  extends: baseView,
  name: "LoginView",
  props: {
    isManagementPage: {
      default: false,
      type: Boolean,
    },
    fromAdmin: {
      default: false,
      type: Boolean,
    },
    containerClass: {
      default: "",
      type: String,
    },
  },
  setup() {
    const { proxy } = getCurrentInstance();

    const appStore = useAppStore();

    const model = reactive({
      account: "",
      password: "",
      role: Role.RoomSeeker,
    });

    const form = ref(false);

    const overlay = ref(false);
    const showPassword = ref(false);

    const login = async () => {
      const me = proxy;

      try {
        const payload = {
          ...me.model,
        };

        overlay.value = true;
        const rs = await api.login(payload);
        handleAfterLogin(rs);
      } catch (error) {
        console.error(error);
        if (error.status === 400) {
          showMessage(
            "Tài khoản, mật khẩu hoặc vai trò không hợp lệ!",
            MessageType.Warning
          );
        } else {
          showMessage("Đã có lỗi xảy ra!", MessageType.Error);
        }
      } finally {
        overlay.value = false;
      }
    };

    const handleAfterLogin = (rs) => {
      const me = proxy;
      if (rs.data && typeof rs.data === "object") {
        const context = { ...rs.data };

        let store = {};
        let localStorageKey = "";

        if (context.role == Role.Admin) {
          localStorageKey = "context_admin";
          store = useContextAdminStore();
        } else if (context.role == Role.Renter || context.role == Role.Innkeeper) {
          localStorageKey = "context_management";
          store = useContextManageStore();
        } else {
          localStorageKey = "context";
          store = useContextStore();
        }

        window.PageRole = context.role;
        store.$state = { ...store.$state, ...context };
        localStorage.setItem(localStorageKey, JSON.stringify(context));

        showMessage("Đăng nhập thành công!");

        if (appStore.$state.showLoginPopup) {
          appStore.toggleLoginPopup();
        }

        if (context.role == Role.Admin) {
          openAdminPage();
        } else if (context.role == Role.Renter || context.role == Role.Innkeeper) {
          me.$router.push({ name: "Management" });
        } else {
          if (appStore.$state.moveToPageAfterLogin) {
            me.$router.push({ name: appStore.$state.moveToPageAfterLogin });
            appStore.$state.moveToPageAfterLogin = "";
          } else if (typeof appStore.$state.callBackAfterLogin === "function") {
            appStore.$state.callBackAfterLogin();
            appStore.$state.callBackAfterLogin = null;
          } else {
            me.$router.push({ name: "RoomSearchView" });
          }
        }
      }
    };

    const openAdminPage = () => {
      const originLink = window.location.origin;
      const newLink = `${originLink}/admin`;
      window.open(newLink, "_blank");
    };

    const signInWithGoogle = () => {
      const provider = new GoogleAuthProvider();
      signInWithPopup(getAuth(), provider).then((res) => {
        loginCallback(res);
      });
    };

    const signInWithFb = () => {
      const provider = new FacebookAuthProvider();
      signInWithPopup(getAuth(), provider).then((res) => {
        loginCallback(res);
      });
    };

    const loginCallback = (res) => {
      overlay.value = true;
      let user = {};
      if (res.uid) {
        user = res;
      } else {
        user = res.user;
      }
      if (user.uid) {
        const payload = {
          UserOauth2Id: user.uid,
          UserName: user.displayName,
          UserEmail: user.email,
          role: proxy.model.role,
        };
        api
          .loginCallback(payload)
          .then((res) => handleAfterLogin(res))
          .finally(() => {
            overlay.value = false;
          });
      }
    };

    const phoneNumberRules = [
      (value) => {
        if (value?.length >= 10) return true;
        return "Số điện thoại phải có ít nhất 10 ký tự";
      },
    ];

    const passwordRules = [
      (value) => {
        if (value?.length >= 8) return true;
        return "Mật khẩu phải có ít nhất 8 ký tự";
      },
    ];

    const onClickOut = () => {
      appStore.toggleLoginPopup();
    };

    // Ẩn combobox khi context yêu cầu role cố định (vd: click đăng bài → luôn là RoomSeeker)
    const isRoleFixed = computed(() =>
      !!appStore.$state.moveToPageAfterLogin ||
      typeof appStore.$state.callBackAfterLogin === "function"
    );

    const loginRoles = computed(() => {
      if (proxy.$props.isManagementPage) {
        return [
          { label: "Đăng bài và tìm trọ", value: Role.RoomSeeker },
          { label: "Người thuê", value: Role.Renter },
          { label: "Chủ trọ", value: Role.Innkeeper },
          { label: "Quản trị viên", value: Role.Admin },
        ];
      }
      return [
        { label: "Người thuê", value: Role.Renter },
        { label: "Chủ trọ", value: Role.Innkeeper },
        { label: "Quản trị viên", value: Role.Admin },
      ];
    });

    onMounted(() => {
      const me = proxy;
      if (me.$props.isManagementPage) {
        me.model.role = Role.RoomSeeker;
      } else if (appStore.$state.LoginWithRole === Role.Admin) {
        me.model.role = Role.Admin;
      } else {
        me.model.role = Role.Renter;
      }
    });

    onUnmounted(() => {
      appStore.$state.LoginWithRole = Role.RoomSeeker;
    });

    return {
      login,
      signInWithGoogle,
      signInWithFb,
      phoneNumberRules,
      model,
      passwordRules,
      showPassword,
      overlay,
      form,
      Role,
      loginRoles,
      isRoleFixed,
      onClickOut,
    };
  },
};
</script>

<style lang="scss">
@import "./TLoginPopup.scss";
</style>