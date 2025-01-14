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

        <v-radio-group
          v-if="isManagementPage"
          v-model="model.role"
          inline
          hide-details
        >
          <v-radio label="Người thuê" :value="Role.Renter"></v-radio>
          <v-radio label="Chủ trọ" :value="Role.Innkeeper"></v-radio>
        </v-radio-group>
        <v-radio-group v-else v-model="model.role" inline hide-details>
          <v-radio label="Đăng hoặc tìm trọ" :value="Role.RoomSeeker"></v-radio>
          <v-radio label="Quản trị viên" :value="Role.Admin"></v-radio>
        </v-radio-group>
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
import { onMounted, reactive, ref, getCurrentInstance } from "vue";
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
import { useContextManageStore } from "../../../stores/contextManageStore";
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
        const context = {
          ...rs.data,
        };

        let store = {};
        let localStorageKey = "";
        if (me.$props.isManagementPage) {
          store = useContextManageStore();
          localStorageKey = "context_management";
          window.PageRole = context.role;
        } else {
          if (context.role == Role.Admin) {
            localStorageKey = "context_admin";
            store = useContextAdminStore();
            window.PageRole = context.role;
          } else {
            localStorageKey = "context";
            store = useContextStore();
          }
        }

        store.$state = {
          ...store.$state,
          ...context,
        };

        localStorage.setItem(localStorageKey, JSON.stringify(context));

        showMessage("Đăng nhập thành công!");

        if (me.$props.isManagementPage) {
          me.$router.push({ name: "Management" });
          window.PageRole = context.role;
        } else {
          appStore.toggleLoginPopup();
          if (appStore.$state.moveToPageAfterLogin) {
            me.$router.push({ name: appStore.$state.moveToPageAfterLogin });
            appStore.$state.moveToPageAfterLogin = "";
          }
          if (context.role == Role.Admin) {
            openAdminPage();
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

    onMounted(() => {
      const me = proxy;
      if (me.$props.isManagementPage) {
        me.model.role = Role.Renter;
      } else if (me.$props.fromAdmin) {
        me.model.role = Role.Admin;
      }
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
      onClickOut,
    };
  },
};
</script>

<style lang="scss">
@import "./TLoginPopup.scss";
</style>