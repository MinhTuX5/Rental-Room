<template>
  <form
    class="w-auto d-flex flex-column justify-center bg-white pa-8 rounded-lg"
  >
    <div class="form-title text-h4 text-center mb-6">Đăng nhập</div>

    <v-sheet class="d-flex justify-space-between mb-4">
      <v-btn class="mr-4 flex1" @click="v$.$validate" color="blue-lighten-1">
        Đăng nhập bằng facebook
      </v-btn>
      <v-btn class="flex1" @click="v$.$validate" color="red-lighten-1">
        Đăng nhập bằng google
      </v-btn>
    </v-sheet>

    <v-text-field
      v-model="state.phoneNumber"
      :error-messages="v$.phoneNumber.$errors.map((e) => e.$message)"
      label="Số điện thoại*"
      required
      @blur="v$.phoneNumber.$touch"
      @input="v$.phoneNumber.$touch"
    ></v-text-field>

    <v-text-field
      v-model="state.password"
      :error-messages="v$.password.$errors.map((e) => e.$message)"
      label="Mật khẩu*"
      required
      class="mt-2"
      @blur="v$.password.$touch"
      @input="v$.password.$touch"
    ></v-text-field>

    <div class="forgot-password text-end">
      <a href="#">Quên mật khẩu?</a>
    </div>

    <v-btn class="mx-auto mt-4" @click="v$.$validate" color="green-lighten-1">
      Đăng nhập
    </v-btn>

    <div class="register text-center mt-4">
      <span>Chưa có tài khoản? </span>
      <a href="#">Đăng ký</a>
    </div>
  </form>
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