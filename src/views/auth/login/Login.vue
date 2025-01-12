<template>
  <v-img
    cover
    src="https://picsum.photos/1920/1080?random"
    class="login-page h-screen d-flex justify-center align-center"
  >
    <template #placeholder>
      <div class="w-100 h-screen background-black" />
    </template>

    <v-container>
      <v-form
        fast-fail
        class="w-50 d-flex flex-column justify-center bg-white pa-8 rounded-lg form"
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

          <v-radio-group v-model="model.role" inline hide-details>
            <v-radio label="Người thuê" :value="Role.Renter"></v-radio>
            <v-radio label="Chủ trọ" :value="Role.Innkeeper"></v-radio>
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

        <div class="register text-center mt-4">
          <span>Chưa có tài khoản? </span>
          <a href="#">Đăng ký</a>
        </div>

        <v-btn
          class="mx-auto mt-4"
          color="red-lighten-1"
          prepend-icon="mdi-google"
          @click="signInWithGoogle"
        >
          Đăng nhập bằng google
        </v-btn>

        <v-btn
          class="mx-auto mt-2"
          color="blue-lighten-1"
          prepend-icon="mdi-facebook"
          @click="signInWithFb"
        >
          Đăng nhập bằng facebook
        </v-btn>
      </v-form>
    </v-container>
  </v-img>
  <v-overlay :model-value="overlay" class="align-center justify-center">
    <v-progress-circular
      color="primary"
      size="64"
      indeterminate
    ></v-progress-circular>
  </v-overlay>
</template>


<script>
import { useLogin } from "./login";

export default {
  name: "LoginView",
  setup() {
    const resource = useLogin();
    return resource;
  },
};
</script>

<style lang="scss">
.login-page {
  .background-black {
    background-color: #000;
  }

  .v-container {
    display: flex;
    align-items: center;
    justify-content: center;

    .form {
      max-width: 500px;
      .v-col {
        padding: unset;
      }
    }
  }
}
</style>